// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ValidarCuestionarioLleno } from '../application/ValidarCuestionarioLleno'
import { SelectOption } from 'components/tables/domain/SelectOption'
import { opcionesTiposCuestionarios } from 'config/utils/medico'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { Ref, defineComponent, ref } from 'vue'
import { isAxiosError } from 'shared/utils'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import CuestionarioDiagnosticoConsumoDrogasHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioDiagnosticoConsumoDrogasPage.vue'
import CuestionarioPsicosocialHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { RespuestaCuestionarioEmpleadoController } from '../infrestructure/RespuestaCuestionarioEmpleadoController'
import { PreguntaController } from 'pages/medico/pregunta/infrestructure/RespuestaCuestionarioEmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoCuestionarioController } from '../infrestructure/TipoCuestionarioController'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { TipoCuestionario } from '../domain/TipoCuestionario'
import { Cuestionario } from '../domain/Cuestionario'

export default defineComponent({
  components: { TabLayout, ButtonSubmits, CuestionarioPsicosocialHeader, CuestionarioDiagnosticoConsumoDrogasHeader },
  props: {
    mixin: { // Para cuestionarios publicos
      type: Object as () => ContenedorSimpleMixin<RespuestaCuestionarioEmpleado>,
      required: false,
    },
  },
  setup(props) {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    /************
     * Variables
     ************/
    const tiposCuestionarios: Ref<TipoCuestionario[]> = ref([])
    const cargando = new StatusEssentialLoading()
    const tipoCuestionarioSeleccionado = ref()
    const { confirmar } = useNotificaciones()

    /****************
     * Controladores
     ****************/
    const tipoCuestionarioController = new TipoCuestionarioController()

    /***********
     * Mixin
     ***********/
    const mixin = props.mixin ?? new ContenedorSimpleMixin(
      RespuestaCuestionarioEmpleado,
      new RespuestaCuestionarioEmpleadoController()
    )
    const { obtenerListados, cargarVista, setValidador, guardar } = mixin.useComportamiento()
    const {
      entidad: respuestaCuestionarioEmpleado,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()

    cargarVista(async () => {
      await obtenerListados({
        preguntas: [],
      })
    })

    tipoCuestionarioController.listar().then((data) => {
      const { result } = data
      tiposCuestionarios.value = result
    })

    /*********
     * Reglas
     *********/
    let reglas = {
      cuestionario: { required },
    }

    const v$ = useVuelidate(reglas, respuestaCuestionarioEmpleado)
    setValidador(v$.value)

    const validarCuestionarioLleno = new ValidarCuestionarioLleno(
      respuestaCuestionarioEmpleado
    )
    mixin.agregarValidaciones(validarCuestionarioLleno)

    /************
     * Funciones
     ************/
    function mapearCuestionario(cuestionario: Cuestionario[]): SelectOption[] {
      return cuestionario.map((item: any) => {
        return {
          ['label']: item.respuesta,
          ['value']: item.id,
        }
      })
    }

    const mapearRespuestas = () => {
      return respuestaCuestionarioEmpleado.cuestionario = listadosAuxiliares.preguntas.map(
        (item: any) => {
          return {
            // respuesta: typeof item.respuesta === 'string' ? item.respuesta : null,
            respuesta_texto: typeof item.respuesta === 'string' ? item.respuesta : null,
            id_cuestionario:
              typeof item.respuesta === 'string'
                ? item.cuestionario[0].id
                : item.respuesta,
          }
        }
      )
    }

    const guardarCuestionario = async () => {
      confirmar(
        'Las respuestas serán enviadas y no podrán ser modificadas. ¿Desea continuar?',
        async () => {
          try {
            mapearRespuestas()
            await guardar(respuestaCuestionarioEmpleado)
            listadosAuxiliares.preguntas = []
            mensaje.value = 'Gracias por completar el cuestionario.'
          } catch (e) {
            console.log(e)
          }
        }
      )
    }

    async function consultarPreguntas(tipoCuestionario: number) {
      tipoCuestionarioSeleccionado.value = tipoCuestionario
      cargando.activar()
      try {
        const { result } = await preguntaController.listar({
          tipo_cuestionario_id: tipoCuestionario,
        })
        listadosAuxiliares.preguntas = result
      } catch (e) {
        if (isAxiosError(e)) {
          const mensajes: string[] = e.erroresValidacion
          mensaje.value = mensajes[0]
        }
      } finally {
        cargando.desactivar()
      }
    }

    /*******
     * Init
     *******/
    const preguntaController = new PreguntaController()
    const mensaje = ref()

    return {
      consultarPreguntas,
      mapearCuestionario,
      listadosAuxiliares,
      tiposCuestionarios,
      mensaje,
      accion,
      guardarCuestionario,
      tipoCuestionarioSeleccionado,
      opcionesTiposCuestionarios,
    }
  }
})

