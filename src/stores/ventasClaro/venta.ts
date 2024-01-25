import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { endpoints } from "config/api";
import { Venta } from "pages/ventas-claro/ventas/domain/Venta";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { reactive, ref } from "vue";

export const useVentaStore = defineStore('venta', () => {
    const venta = reactive(new Venta())
    const ventaReset = new Venta()
    const idVenta = ref()
    const { notificarAdvertencia, notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    async function obtenerComision(idProducto:number, forma_pago:string, idVendedor:number) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta =axios.getEndpoint(endpoints.obtener_comision) +'/' +idProducto +'/' +forma_pago +'/' +idVendedor
        const response: AxiosResponse = await axios.get(ruta)
        return response.data.comision_value
      }

    return {
        venta, idVenta,

        obtenerComision,
    }
})