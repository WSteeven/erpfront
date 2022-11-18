import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { acciones } from "config/utils";

export const useTransaccionEgresoStore = defineStore("transaccion", () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const transaccionReset = new Transaccion()
    

    const accionTransaccion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultarTransaccion(id: number) {
        // console.log('Pasó por aquí');
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarTransaccion(id: number) {
        const modelo = await consultarTransaccion(id)
        // console.log('modelo obtenido: ',modelo)
        transaccion.hydrate(modelo)
    }

    function resetearTransaccion(){
        transaccion.hydrate(transaccionReset)
    }
   
    return {
        // State
        transaccion,
        accionTransaccion,
        cargarTransaccion,
        resetearTransaccion,

    }
})