import { defineComponent, reactive, ref } from 'vue'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'
import { required } from 'shared/i18n-validators'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { useVuelidate } from '@vuelidate/core'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import {maskFecha} from 'config/utils';
import {useNotificacionStore} from 'stores/notificacion';
import {useQuasar} from 'quasar';
import {useCargandoStore} from 'stores/cargando';

export default defineComponent({
  components: { ErrorComponent, NoOptionComponent },
  setup() {
    const { notificarError, notificarCorrecto } = useNotificaciones()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const reporte = reactive({
      fecha_inicio: '',
      fecha_fin: '',
      accion: 'excel',
      tipo: ''
    })
    const SISTEMA = 'SISTEMA'
    const APPENATE = 'ESTADISTICAS'

    const tiposDashboard: OptionGroup[] = [
      { label: SISTEMA, value: SISTEMA },
      { label: APPENATE, value: APPENATE }
    ]
    const tipoDashboard = ref(SISTEMA)

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required }
    }

    const v$ = useVuelidate(reglas, reporte)

    async function buscarReporte() {
      if (await v$.value.$validate())
        try {
          const axios = AxiosHttpRepository.getInstance()
          const url = `${apiConfig.URL_BASE}/${axios.getEndpoint(
            endpoints.reporte_asistencia_tecnicos
          )}`
          const filename = `reporte asistencia del ${reporte.fecha_inicio} al ${reporte.fecha_fin}`
          await imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, reporte)
          notificarCorrecto('Reporte impreso con éxito')
        } catch (e) {
          console.log(e)
          notificarError('Error al obtener reporte')
        }
    }

    return {
      reporte,
      v$,
      buscarReporte,
      tipoDashboard,
      tiposDashboard,
      SISTEMA, maskFecha,
      APPENATE
    }
  }
})
