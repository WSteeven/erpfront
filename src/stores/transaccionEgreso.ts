import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'
import { ApiError } from 'shared/error/domain/ApiError'
import { imprimirArchivo, notificarMensajesError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'

export const useTransaccionEgresoStore = defineStore('transaccion', () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const transaccionReset = new Transaccion()
    const idTransaccion = ref()
    const estadoPendiente = ref(false)

    const accionTransaccion = acciones.nuevo
    const notificaciones = useNotificaciones()
    const statusLoading = new StatusEssentialLoading()

    async function consultarTransaccion(id: number) {
        // console.log('Pasó por aquí')
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) +'/'+ id
        const response: AxiosResponse = await axios.get(ruta)
        statusLoading.desactivar()

        return response.data.modelo
    }

    async function cargarTransaccion(id: number) {
        const modelo = await consultarTransaccion(id)
        // console.log('modelo obtenido: ',modelo)
        transaccion.hydrate(modelo)
    }

    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_egresos) + '/show-preview/' + idTransaccion.value
        const response: AxiosResponse = await axios.get(ruta)
        transaccion.hydrate(response.data.modelo)
    }

    function resetearTransaccion() {
        transaccion.hydrate(transaccionReset)
    }

    async function filtrarEgresosComprobantes(filtro){
      try {
          statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            // const url = apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.transacciones_egresos)+'/filtrar?criterio='+filtro
            const url =apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.comprobantes_filtrados)+'?estado='+filtro
            console.log(url)
            const response: AxiosResponse = await axios.get(url)
            return response.data.results
        } catch (error:any) {
            const errorApi = new ApiError(error)
            const mensajes: string[] = errorApi.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
        }finally{
            statusLoading.desactivar()
        }
    }
    async function filtrarTransaccionesEgresos(filtro){
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = axios.getEndpoint(endpoints.egresos_filtrados)+'?estado='+filtro
            const response: AxiosResponse=await axios.get(url)
            return response.data.results
        } catch (error:any) {
            const errorApi = new ApiError(error)
            const mensajes:string[]= errorApi.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
        }finally{
            statusLoading.desactivar()
        }
    }

    async function imprimirEgreso() {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/imprimir/' + idTransaccion.value
        const filename = 'egreso_' + idTransaccion.value + '_' + Date.now()
        imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
        console.log('Egreso impreso con éxito.')
    }

    return {
        // State
        transaccion,
        accionTransaccion,
        estadoPendiente,
        cargarTransaccion,
        resetearTransaccion,
        idTransaccion,
        showPreview,
        filtrarEgresosComprobantes,
        filtrarTransaccionesEgresos,
        imprimirEgreso,

    }
})
