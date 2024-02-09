import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, ref } from 'vue'
import { RespuestaCuestionarioEmpleadoController } from '../infrestructure/RespuestaCuestionarioEmpleadoController'
import { RespuestaCuestionarioEmpleado } from '../domain/RespuestaCuestionarioEmpleado'
import { PreguntaController } from 'pages/medico/pregunta/infrestructure/RespuestaCuestionarioEmpleadoController'
import { required } from 'shared/i18n-validators'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import useVuelidate from '@vuelidate/core'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useNotificaciones } from 'shared/notificaciones'

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
    const mixin = new ContenedorSimpleMixin(
      RespuestaCuestionarioEmpleado,
      new RespuestaCuestionarioEmpleadoController()
    )
    const preguntas = ref([])
    const { obtenerListados, cargarVista, setValidador, guardar } =
      mixin.useComportamiento()
    const {
      entidad: respuesta_cuestionario_empleado,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { notificarAdvertencia } = useNotificaciones()
    //Obtener el listados
    cargarVista(async () => {
      await obtenerListados({
        preguntas: {
          controller: new PreguntaController(),
          params: {
            campos: 'id,codigo,pregunta',
          },
        },
      })
      preguntas.value = listadosAuxiliares.preguntas
    })
    const reglas = {
      cuestionario: {
        required,
      },
    }
    const v$ = useVuelidate(reglas, respuesta_cuestionario_empleado)
    setValidador(v$.value)
    function mapearArray(arreglo) {
      const new_array = arreglo.map((item) => {
        return {
          ['label']: item.respuesta.respuesta,
          ['value']: item.id,
        }
      })
      return new_array
    }
    async function guardarDatos() {
      respuesta_cuestionario_empleado.cuestionario = preguntas.value.map(
        (item: any) => {
          return {
            ['id_cuestionario']: !Array.isArray(item.respuesta)
              ? item.respuesta
              : null,
          }
        }
      )
      const cuestionariosConIdValido =
        respuesta_cuestionario_empleado.cuestionario.filter(
          (cuestionario) =>
            cuestionario.hasOwnProperty('id_cuestionario') &&
            cuestionario.id_cuestionario !== null
        )

      if (preguntas.value.length === cuestionariosConIdValido.length) {
        await guardar(respuesta_cuestionario_empleado)
      } else {
        notificarAdvertencia('No ha llenado todo el cuestionario!')
      }
    }
    return {
      accion,
      mixin,
      v$,
      preguntas,
      respuesta_cuestionario_empleado,
      mapearArray,
      guardarDatos,
    }
  },
})
