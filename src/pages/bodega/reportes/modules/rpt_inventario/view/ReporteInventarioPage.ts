import { apiConfig, endpoints } from 'config/api';
import { LocalStorage, useQuasar } from 'quasar';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { imprimirArchivo } from 'shared/utils';
import { useCargandoStore } from 'stores/cargando';
import { useNotificacionStore } from 'stores/notificacion';
import { Ref, defineComponent, ref } from 'vue';

export default defineComponent({
  components: {},
  setup() {

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    let sucursal = ref()
    const sucursales: Ref<any[]> = ref([])


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
    //agregar otra opcion
    sucursales.value.unshift({ id: 0, lugar: 'TODAS LAS SUCURSALES', })
    return {
      sucursales,
      sucursal,
      generarReporte,
      filtroSucursales(val, update) {
        if (val === '') {
          update(() => {
            sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          sucursales.value = JSON.parse(LocalStorage.getItem('sucursales')!.toString()).filter((v) => v.lugar.toLowerCase().indexOf(needle) > -1)
        })
      },
    }
  }
})
