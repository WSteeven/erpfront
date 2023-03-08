// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ref, reactive, defineComponent, onMounted } from 'vue'
import { required, requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

// Logica y controladores
import { useSubtareaStore } from 'stores/subtarea'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { useNotificaciones } from 'shared/notificaciones'
import { maskFecha } from 'config/utils'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

export default defineComponent({
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: true,
    },
  },
  emits: ['cerrar-modal', 'seleccionar'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /********
     * Mixin
     ********/
    const { listado } = props.mixinModal.useReferencias()

    /************
     * Variables
     ************/
    const codigoTrabajoSeleccionado = subtareaStore.codigoTrabajoSeleccionado
    const subtarea = reactive(new Subtarea())
    const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()

    onMounted(() => {
      subtarea.es_ventana = subtareaStore.subtareaEsVentana
      subtarea.fecha_inicio_trabajo = subtareaStore.fechaInicioTrabajo
      subtarea.hora_inicio_trabajo = subtareaStore.horaInicioTrabajo
      subtarea.hora_fin_trabajo = subtareaStore.horaFinTrabajo
    })

    /*************
    * Validaciones
    **************/
    const rules = {
      fecha_inicio_trabajo: { required },
      hora_inicio_trabajo: { required: requiredIf(() => subtarea.es_ventana) },
      hora_fin_trabajo: { required: requiredIf(() => subtarea.es_ventana) },
    }

    const v$ = useVuelidate(rules, subtarea)

    /*************
     * Funciones
     *************/
    async function reagendar() {
      const statusEssentialLoading = new StatusEssentialLoading()

      const data = {
        es_ventana: subtarea.es_ventana,
        fecha_inicio_trabajo: subtarea.fecha_inicio_trabajo,
        hora_inicio_trabajo: subtarea.hora_inicio_trabajo,
        hora_fin_trabajo: subtarea.hora_fin_trabajo,
      }

      try {

        statusEssentialLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.actualizar_fechas_reagendar) + '/' + subtareaStore.idSubtareaSeleccionada
        const response: AxiosResponse = await axios.put(ruta, data)
        actualizarElemento(subtareaStore.posicionSubtareaSeleccionada, response.data.modelo)
        emit('cerrar-modal')
        notificarCorrecto(response.data.mensaje)
      } catch (e) {
        notificarAdvertencia('No se pudo agendar la subtarea')
      } finally {
        statusEssentialLoading.desactivar()
      }
    }

    function actualizarElemento(posicion: number, entidad: Subtarea): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad)
        listado.value = [...listado.value]
      }
    }

    return {
      v$,
      subtarea,
      codigoTrabajoSeleccionado,
      reagendar,
      maskFecha,
    }
  }
})

// obtenerPausas()
