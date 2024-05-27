import { SelectOption } from 'components/tables/domain/SelectOption'
import { Cuestionario } from '../domain/Cuestionario'
import { TipoCuestionario } from '../domain/TipoCuestionario'
import { TipoCuestionarioController } from '../infrestructure/TipoCuestionarioController'
import { Ref, defineComponent, ref } from 'vue'
import { RespuestaCuestionarioEmpleadoController } from '../infrestructure/RespuestaCuestionarioEmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { PreguntaController } from 'pages/medico/pregunta/infrestructure/RespuestaCuestionarioEmpleadoController'
import { isAxiosError } from 'shared/utils'
import useVuelidate from '@vuelidate/core'
import { ValidarCuestionarioLleno } from '../application/ValidarCuestionarioLleno'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'


// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import CuestionarioPsicosocialHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'
import CuestionarioDiagnosticoConsumoDrogasHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioDiagnosticoConsumoDrogasPage.vue'
import { opcionesTiposCuestionarios } from 'config/utils/medico'
import { useNotificaciones } from 'shared/notificaciones'


export default defineComponent({
  components: { TabLayout, ButtonSubmits, CuestionarioPsicosocialHeader, CuestionarioDiagnosticoConsumoDrogasHeader },
  setup(props) {

    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    // Variables
    const tiposCuestionarios: Ref<TipoCuestionario[]> = ref([])
    const cargando = new StatusEssentialLoading()
    const tipoCuestionarioSeleccionado = ref()
    const { confirmar } = useNotificaciones()
    /* const objetivo =
      'El objetivo de este cuestionario es conocer algunos aspectos sobre las condiciones psicosociales en tu trabajo. El cuestionario es anónimo y se garantiza la confidencialidad de las respuestas. Con el fin de que la información que se obtenga sea útil es necesario que contestes sinceramente a todas las preguntas. Si hay alguna pregunta sin contestar el cuestionario no será válido. Tras leer atentamente cada pregunta así como sus opciones de respuesta, marca en cada caso la respuesta que consideres más adecuada, señalando una sola respuesta por cada pregunta.' */

    // Controladores
    const tipoCuestionarioController = new TipoCuestionarioController()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      RespuestaCuestionarioEmpleado,
      new RespuestaCuestionarioEmpleadoController()
    )
    const { obtenerListados, cargarVista, setValidador, guardar, reestablecer } =
      mixin.useComportamiento()
    const {
      entidad: respuestaCuestionarioEmpleado,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { onBeforeGuardar } = mixin.useHooks()

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
    const reglas = {
      cuestionario: {
        required,
      },
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

    const guardarCuestionario = async () => {
      confirmar(
        'Las respuestas serán enviadas y no podrán ser modificadas. ¿Desea continuar?',
        async () => {
          try {
            await guardar(respuestaCuestionarioEmpleado)
            listadosAuxiliares.preguntas = []
            mensaje.value = 'Gracias por completar el cuestionario.'
          } catch (e) {
            console.log(e)
          }
        }
      )
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      respuestaCuestionarioEmpleado.cuestionario = listadosAuxiliares.preguntas.map(
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
    })

    /*******
     * Init
     *******/
    const preguntaController = new PreguntaController()
    const mensaje = ref()

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
    // consultarPreguntas()

    return {
      consultarPreguntas,
      mapearCuestionario,
      listadosAuxiliares,
      tiposCuestionarios,
      // objetivo,
      mensaje,
      accion,
      guardarCuestionario,
      tipoCuestionarioSeleccionado,
      opcionesTiposCuestionarios,
    }
  }
})

