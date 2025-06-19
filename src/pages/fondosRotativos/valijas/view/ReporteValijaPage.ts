import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Valija } from 'pages/fondosRotativos/valijas/domain/Valija'
import { ValijaController } from 'pages/fondosRotativos/valijas/infraestructure/ValijaController'
import {defineComponent, reactive} from 'vue'
import { maskFecha } from 'config/utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import ErrorComponent from 'components/ErrorComponent.vue'
import { imprimirArchivo } from 'shared/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import {useNotificacionStore} from 'stores/notificacion';
import {useQuasar} from 'quasar';
import {useCargandoStore} from 'stores/cargando';

export default defineComponent({
  components: { ErrorComponent },
  setup() {
    const mixin = new ContenedorSimpleMixin(Valija, new ValijaController())
    const { disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const reporte = reactive({
      fecha_inicio: '',
      fecha_fin: ''
    })

    //Reglas de validacion
    const reglas = {
      fecha_inicio: {
        required
      },
      fecha_fin: {
        required
      }
    }
    const v$ = useVuelidate(reglas, reporte)
    setValidador(v$.value)

    async function generarReporte(tipo: string) {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        let url: string
        const filename =
          'Reporte de valija de ' +
          reporte.fecha_inicio +
          ' al ' +
          reporte.fecha_fin
        switch (tipo) {
          case 'excel':
            url =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.reporte_valijas) +
              'excel'
            await imprimirArchivo(
              url,
              'POST',
              'blob',
              'xlsx',
              filename,
              reporte
            )
            break
          default:
            url =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.reporte_valijas) +
              'pdf'
            await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
        }
      }
    }

    return {
      reporte,
      disabled,
      v$,
      maskFecha,

      // funciones
      generarReporte
    }
  }
})
