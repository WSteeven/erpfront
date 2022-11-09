import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { acciones } from "config/utils";
import { DetalleProductoTransaccion } from "pages/bodega/transacciones/modules/detalle_producto_transaccion/domain/DetalleProductoTransaccion";
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto";

export const useTransaccionIngresoStore = defineStore("transaccion", () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const detalleTransaccion = reactive(new DetalleProductoTransaccion()) //los detalles de la transaccion
    const detalle = reactive(new DetalleProducto())//el detalle

    // const detalleTransaccionReset = new DetalleProductoTransaccion()
    const detalleReset = new DetalleProducto()

    const accionTransaccion = acciones.nuevo
    const accionDetalleTransaccion = acciones.nuevo
    const accionDetalle = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultarDetalleProducto(id:number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.detalles)+id
        const response: AxiosResponse=await axios.get(ruta)
        detalle.hydrate(response.data.modelo)
        statusLoading.desactivar()
    }

    function resetearDetalleProducto(){
        detalle.hydrate(detalleReset)
    }

    /* async function consultarDetalleTransaccion(transaccion_id: number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.detalle_producto_transaccion) + '?transaccion_id=' + transaccion_id
        const response: AxiosResponse = await axios.get(ruta)
        detalleTransaccion.hydrate(response.data.results)
        statusLoading.desactivar()
    }

    function resetearDetalleTransaccion() {
        detalleTransaccion.hydrate(detalleTransaccionReset)
    } */

    return {
        // State
        transaccion,
        accionTransaccion,
        
        detalleTransaccion,
        accionDetalleTransaccion,
        
        detalle,
        accionDetalle,

        // consultarDetalleTransaccion,
        consultarDetalleProducto,
        //accion
        resetearDetalleProducto,
        // resetearDetalleTransaccion,
    }
})