import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { Devolucion } from "pages/bodega/devoluciones/domain/Devolucion";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { acciones } from "config/utils";

export const useDevolucionStore = defineStore('devolucion', ()=>{
    //State
    const devolucion = reactive(new Devolucion())
    const devolucionReset = new Devolucion()
    const idDevolucion = ref()

    const accionDevolucion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultar(id:number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.devoluciones)+id
        const response:AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarDevolucion(id:number) {
        const modelo = await consultar(id)
        devolucion.hydrate(modelo)
    }

    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.devoluciones) + 'show-preview/' + idDevolucion.value
        const response: AxiosResponse = await axios.get(ruta)
        devolucion.hydrate(response.data.modelo)
    }

    function resetearDevolucion(){
        devolucion.hydrate(devolucionReset)
    }

    return {
        devolucion,
        accionDevolucion,
        cargarDevolucion,
        resetearDevolucion,
        idDevolucion,
        showPreview,
    }
})