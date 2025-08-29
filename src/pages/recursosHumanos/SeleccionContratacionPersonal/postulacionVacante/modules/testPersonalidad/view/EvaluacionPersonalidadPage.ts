import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EvaluacionPersonalidad } from 'seleccionContratacion/postulacionVacante/modules/testPersonalidad/domain/EvaluacionPersonalidad'
import { EvaluacionPersonalidadController } from 'seleccionContratacion/postulacionVacante/modules/testPersonalidad/infraestructure/EvaluacionPersonalidadController'
import { defineComponent, onMounted, ref } from 'vue'
import { usePostulacionStore } from 'stores/recursosHumanos/seleccionContratacion/postulacion'
import { acciones } from 'config/utils'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { PostulacionController } from 'seleccionContratacion/postulacionVacante/infraestructure/PostulacionController'
import CalloutComponent from 'components/CalloutComponent.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosResponse } from 'axios'
import { imprimirArchivo } from 'shared/utils'
import { apiConfig, endpoints } from 'config/api'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    OptionGroupComponent,
    CalloutComponent,
    ButtonSubmits
  },
  emits: ['cerrar-modal'],
  setup(_, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      EvaluacionPersonalidad,
      new EvaluacionPersonalidadController()
    )
    const { entidad: evaluacion, accion, disabled } = mixin.useReferencias()
    const { editar, reestablecer } = mixin.useComportamiento()
    const { onModificado, onReestablecer } = mixin.useHooks()
    const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const postulacionStore = usePostulacionStore()
    const tieneEvaluacionCreada = ref(false)

    const axios = AxiosHttpRepository.getInstance()
    const cargando = new StatusEssentialLoading()

    onModificado(() => emit('cerrar-modal'))
    onReestablecer(() => emit('cerrar-modal'))

    /***************************************************************************
     * FUNCIONES
     ***************************************************************************/
    async function consultarTokenEvaluacion() {
      const { result } = await new PostulacionController().consultar(
        postulacionStore.idPostulacion
      )
      if (result.token_test !== undefined && result.token_test !== null)
        tieneEvaluacionCreada.value = true
    }

    async function obtenerEvaluacion() {
      const { result } = await new EvaluacionPersonalidadController().listar({
        postulacion_id: postulacionStore.idPostulacion
      })
      if (result[0]) {
        evaluacion.hydrate(result[0])
        evaluacion.postulacion = postulacionStore.idPostulacion
        accion.value = acciones.consultar
      } else {
        accion.value = acciones.consultar
      }
    }

    async function enviarEvaluacionPostulante() {
      try {
        cargando.activar()
        const ruta =
          axios.getEndpoint(endpoints.habilitar_test_personalidad) +
          postulacionStore.idPostulacion
        const response: AxiosResponse = await axios.post(ruta)
        if (response.status === 200) {
          await navigator.clipboard.writeText(response.data.link)
          notificarCorrecto('¡El enlace ha sido copiado al portapapeles!')
          emit('cerrar-modal')
        }
      } catch (e: any) {
        console.error(e)
        notificarAdvertencia(
          'Hubo un problema al habilitar el test de personalidad.'
        )
      } finally {
        cargando.desactivar()
      }
    }

    async function descargarEvaluacionResuelta() {
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.descargar_evaluacion_personalidad) +
        postulacionStore.idPostulacion
      await imprimirArchivo(
        url,
        'GET',
        'blob',
        'xlsx',
        'evaluacion_16PF_resuelta'
      )
    }

    onMounted(async () => {
      await consultarTokenEvaluacion()
      if (tieneEvaluacionCreada.value) await obtenerEvaluacion()
    })

    return {
      evaluacion,
      accion,
      acciones,
      disabled,
      tieneEvaluacionCreada,

      //funciones
      enviarEvaluacionPostulante,
      descargarEvaluacionResuelta,
      editar,
      reestablecer
    }
  }
})
