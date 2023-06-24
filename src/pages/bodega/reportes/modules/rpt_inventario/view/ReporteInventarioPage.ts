import { apiConfig, endpoints } from "config/api";
import { LocalStorage, useQuasar } from "quasar";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { imprimirArchivo } from "shared/utils";
import { useCargandoStore } from "stores/cargando";
import { useNotificacionStore } from "stores/notificacion";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {},
  setup() {

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    let sucursal=ref()
    const sucursales = ref([])


    async function generarReporte(tipo: string) {
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'reporte_historico_inventario'
      let url
      switch (tipo) {
        case 'excel':
          url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_inventario) + '/excel/' + sucursal.value
          imprimirArchivo(url, 'GET', 'blob', 'xlsx', filename)
          break;
        case 'pdf':
          url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_inventario) + '/pdf/' + sucursal.value
          imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
          break;
        default:
          break;
      }
    }

    sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    return {
      sucursales,
      sucursal,
      generarReporte,
    }
  }
})
