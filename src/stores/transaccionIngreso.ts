import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { acciones } from "config/utils";
import { DetalleProductoTransaccion } from "pages/bodega/transacciones/modules/detalle_producto_transaccion/domain/DetalleProductoTransaccion";

export const useTransaccionIngresoStore = defineStore('transaccion-ingreso', () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const detalleTransaccion = reactive(new DetalleProductoTransaccion())
    //detalle_producto_transaccion - listado de detalles de la transaccion seleccionada
    const accionTransaccion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()
    async function consultarTransaccion(id: number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()
    }

    function resetearTransaccion() {
        //
    }

    return {
        // State
        transaccion,
        accionTransaccion,

        consultarTransaccion,

        resetearTransaccion,



    }
})