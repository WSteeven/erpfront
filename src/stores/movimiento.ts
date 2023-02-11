import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Movimiento } from 'pages/bodega/movimientos/domain/Movimiento'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'

export const useMovimientoStore = defineStore('movimiento', () => {
    //State
    const movimiento = reactive(new Movimiento())
    const movimientoReset = new Movimiento()

    const accionMovimiento = acciones.nuevo
    const cerrarModal = ref(false)

    const statusLoading = new StatusEssentialLoading()

    async function consultarMovimiento(id: number) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.movimientos) + id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarMovimiento(id: number) {
        const modelo = await consultarMovimiento(id)
        movimiento.hydrate(modelo)
    }

    //enviar listado de movimientos 
    async function guardarMovimiento(movimientos: any) {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.movimientos)
        const response: AxiosResponse = await axios.post(ruta, movimientos)
        statusLoading.desactivar()
        console.log('response es: ', response)
        cerrarModal.value = response.data.status === 200 ? true : false
        console.log('mensaje recibido', response.data.mensaje)
        return response.data.modelo
    }

    async function enviarMovimiento(movimiento: any) {
        const modelo = await guardarMovimiento(movimiento)
        console.log('movimiento guardado', modelo)
        // movimiento.hydrate(modelo)
    }


    function resetearMovimiento() {
        movimiento.hydrate(movimientoReset)
    }

    return {
        //state
        movimiento,
        accionMovimiento,
        cargarMovimiento,
        enviarMovimiento,
        resetearMovimiento,
        cerrarModal,
    }
})