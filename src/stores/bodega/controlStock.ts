import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { apiConfig, endpoints } from "config/api";
import { acciones } from "config/utils";
import { ControlStock } from "pages/bodega/control_stocks/domain/ControlStock";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { reactive, ref } from "vue";

export const useControlStockStore = defineStore('controlStock', () => {
  //State
  const controlStock = reactive(new ControlStock())
  const controlStockReset = new ControlStock()
  const idControl = ref()
  const listadoItems = ref([])

  const { notificarAdvertencia, notificarError } = useNotificaciones()
  const accionPreorden = acciones.nuevo
  const cargando = new StatusEssentialLoading()

  /*******************************************************************************************
   * Funciones
   ******************************************************************************************/
  async function consolidarItems() {
    try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.items_control_stocks_consolidados)
        const response: AxiosResponse = await axios.get(url)
        listadoItems.value = response.data.results
    } catch (e: any) {
        notificarError(e)
    } finally {
        cargando.desactivar()
    }
}
async function crearOrdenCompraConsolidada(data){
  console.log("Diste clic en crearOrdenCompraConsolidada")
  console.log("Data recibida", data)
}
return {

  listadoItems,

  //funciones
  consolidarItems,
  crearOrdenCompraConsolidada,
}

})

