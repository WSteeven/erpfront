import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { acciones } from "config/utils";

export const useTransaccionIngresoStore = defineStore("transaccion", () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const transaccionReset = new Transaccion()
    // const detalleTransaccion = reactive(new DetalleProductoTransaccion()) //los detalles de la transaccion

    // const detalleTransaccionReset = new DetalleProductoTransaccion()

    const accionTransaccion = acciones.nuevo
    // const accionDetalleTransaccion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultarTransaccion(id: number) {
        console.log('Pasó por aquí');
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarTransaccion(id: number) {
        const modelo = await consultarTransaccion(id)
        console.log('modelo obtenido: ',modelo)
        transaccion.hydrate(modelo)
    }

    function resetearTransaccion(){
        transaccion.hydrate(transaccionReset)
    }
    /* async function asignarDetalle(id: number) {
        const modelo = await consultarDetalleProducto(id)
        detalle.hydrate(modelo)
    }

    function resetearDetalleProducto() {
        detalle.hydrate(detalleReset)
    } */

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
        cargarTransaccion,
        resetearTransaccion,

        /* detalleTransaccion,
        accionDetalleTransaccion,

        detalle,
        accionDetalle, */

        // consultarDetalleTransaccion,
        // consultarDetalleProducto,
        //accion
        // resetearDetalleProducto,
        // resetearDetalleTransaccion,

        //funcion para consultar y asignar un detalle
        // asignarDetalle,
    }
})