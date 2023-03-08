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

export default defineComponent({
  emits: ['cerrar-modal', 'seleccionar'],
  setup() {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /************
     * Variables
     ************/
    const codigoTrabajoSeleccionado = subtareaStore.codigoTrabajoSeleccionado
    const subtarea = reactive(new Subtarea())

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
      //
    }

    /* async function obtenerPausas() {
      const statusEssentialLoading = new StatusEssentialLoading()
      statusEssentialLoading.activar()

      const axios = AxiosHttpRepository.getInstance()
      const ruta =
        axios.getEndpoint(endpoints.pausas_subtareas) +
        '/' +
        subtareaStore.idSubtareaSeleccionada
      const response: AxiosResponse = await axios.get(ruta)
      listado.value = response.data.results

      statusEssentialLoading.desactivar()
    } */

    return {
      v$,
      subtarea,
      codigoTrabajoSeleccionado,
      reagendar,
    }
  }
})

// obtenerPausas()
