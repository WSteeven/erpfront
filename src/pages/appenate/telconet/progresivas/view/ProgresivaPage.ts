import { defineComponent } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Progresiva } from 'pages/appenate/telconet/progresivas/domain/Progresiva'
import { ProgresivaController } from 'pages/appenate/telconet/progresivas/infraestructure/ProgresivaController'
import { configuracionColumnasProgresivas } from 'pages/appenate/telconet/progresivas/domain/configuracionColumnasProgresivas'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ErrorComponent from 'components/ErrorComponent.vue'
import { acciones } from 'config/utils'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasPostesProgresivas } from 'pages/appenate/telconet/progresivas/domain/configuracionColumnasPostesProgresivas'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { imprimirArchivo } from 'shared/utils'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { EssentialTable, ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Progresiva,
      new ProgresivaController()
    )
    const { entidad: progresiva, accion, disabled } = mixin.useReferencias()

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()

    /********************
     * FUNCIONES
     ********************/
    async function imprimirArchivos(
      tipo = 'excel',
      filename: string,
      id: number
    ) {
      try {
        const axios = AxiosHttpRepository.getInstance()
        let url: string

        switch (tipo) {
          case 'kml':
            url =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.imprimir_kml) +
              id
            await imprimirArchivo(url, 'GET', 'blob', 'kml', filename)
            break
          default:
            url =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.imprimir_ot) +
              id
            await imprimirArchivo(url, 'GET', 'blob', 'xlsx', filename)
        }
      } catch (error) {
        console.error(error)
      }
    }

    /********************
     * BOTONES DE TABLA
     ********************/
    const btnImprimirOT: CustomActionTable<Progresiva> = {
      titulo: 'Imprimir OT',
      icono: 'bi-file-earmark-excel-fill',
      color: 'positive',
      accion: async ({ entidad }) => {
        console.log('Aqui se imprime el excel')
        await imprimirArchivos('excel', entidad.filename, entidad.id)
      },
      visible: () => true
    }
    const btnImprimirKML: CustomActionTable = {
      titulo: 'Imprimir KML',
      icono: 'bi-filetype-xml',
      color: 'grey',
      accion: async ({ entidad }) => {
        console.log('Aqui se imprime el kml con las coordenadas')
        await imprimirArchivos('kml', entidad.filename, entidad.id)
      },
      visible: () => true
    }

    return {
      mixin,
      progresiva,
      accion,
      acciones,
      disabled,
      configuracionColumnas: configuracionColumnasProgresivas,
      configuracionColumnasPostesProgresivas,

      //botones de tabla
      btnImprimirOT,
      btnImprimirKML
    }
  }
})
