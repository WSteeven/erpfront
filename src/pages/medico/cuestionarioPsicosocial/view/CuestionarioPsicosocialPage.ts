// Dependencias
import { SelectOption } from 'components/tables/domain/SelectOption'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { RespuestaCuestionarioEmpleadoController } from '../infrestructure/RespuestaCuestionarioEmpleadoController'
import { PreguntaController } from 'pages/medico/pregunta/infrestructure/RespuestaCuestionarioEmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { ValidarCuestionarioLleno } from '../application/ValidarCuestionarioLleno'
import { Cuestionario } from '../domain/Cuestionario'
import { isAxiosError } from 'shared/utils'

export default defineComponent({
  components: { TabLayout, ButtonSubmits },

  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(RespuestaCuestionarioEmpleado, new RespuestaCuestionarioEmpleadoController())
    const { obtenerListados, cargarVista, setValidador, guardar, reestablecer } = mixin.useComportamiento()
    const { entidad: respuestaCuestionarioEmpleado, accion, listadosAuxiliares } = mixin.useReferencias()
    const { onBeforeGuardar } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        preguntas: [],
      })
    })

    /***********
    * Variables
    ************/
    const objetivo = 'El objetivo de este cuestionario es conocer algunos aspectos sobre las condiciones psicosociales en tu trabajo. El cuestionario es anónimo y se garantiza la confidencialidad de las respuestas. Con el fin de que la información que se obtenga sea útil es necesario que contestes sinceramente a todas las preguntas. Si hay alguna pregunta sin contestar el cuestionario no será válido. Tras leer atentamente cada pregunta así como sus opciones de respuesta, marca en cada caso la respuesta que consideres más adecuada, señalando una sola respuesta por cada pregunta.'

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

    const validarCuestionarioLleno = new ValidarCuestionarioLleno(respuestaCuestionarioEmpleado)
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

    const confirmarLimpiarFormulario = () => {
      //
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      respuestaCuestionarioEmpleado.cuestionario = listadosAuxiliares.preguntas.map((item: any) => {
        return {
          id_cuestionario: item.respuesta
        }
      })
    })

    /*******
     * Init
     *******/
    const preguntaController = new PreguntaController()
    const mensaje = ref()
    const consultarPreguntas = async () => {
      try {
        const { result } = await preguntaController.listar()
        listadosAuxiliares.preguntas = result
      } catch (e) {
        if (isAxiosError(e)) {
          const mensajes: string[] = e.erroresValidacion
          mensaje.value = mensajes[0]
        }
      }
    }
    consultarPreguntas()

    return {
      v$,
      accion,
      mixin,
      listadosAuxiliares,
      respuestaCuestionarioEmpleado,
      mapearCuestionario,
      guardar,
      reestablecer,
      objetivo,
      mensaje,
    }
  },
})
