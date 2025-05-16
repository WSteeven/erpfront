import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones } from 'config/utils'
import { imprimirArchivo, notificarErrores, notificarMensajesError } from 'shared/utils'
import { ApiError } from 'shared/error/domain/ApiError'
import { useNotificaciones } from 'shared/notificaciones'

export const useTransaccionStore = defineStore('transaccion', () => {
    //State
    const transaccion = reactive(new Transaccion()) //la transaccion
    const transaccionReset = new Transaccion()
    const idTransaccion = ref()
    const tab = ref('')

    const notificaciones = useNotificaciones()
    const accionTransaccion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultarTransaccion(id: number) {
        // console.log('Pasó por aquí')
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

    async function imprimirIngreso() {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_ingresos) + '/imprimir/' + idTransaccion.value
        const filename = 'ingreso_' + idTransaccion.value + '_' + Date.now()
        imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
        console.log('Ingreso impreso con éxito.')
        // const response: AxiosResponse = await axios.get(ruta, responseType:'blob')
    }
    async function imprimirEgreso() {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/imprimir/' + idTransaccion.value
        const filename = 'egreso_' + idTransaccion.value + '_' + Date.now()
        imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
        console.log('Egreso impreso con éxito.')
    }
    async function imprimirActaEntregaRecepcion() {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/imprimir-entrega-recepcion/' + idTransaccion.value
        const filename = 'acta_entrega_recepcion_' + idTransaccion.value + '_' + Date.now()
        imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }
    async function showPreview() {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + '/show-preview/' + idTransaccion.value
        const response: AxiosResponse = await axios.get(ruta)
        transaccion.hydrate(response.data.modelo)
        statusLoading.desactivar()
    }
    async function showPreviewEgreso() {
        statusLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_egresos) + '/show-preview/' + idTransaccion.value
        const response: AxiosResponse = await axios.get(ruta)
        transaccion.hydrate(response.data.modelo)
        statusLoading.desactivar()
    }
    async function editarItemEgreso(data) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.modificar_item_egreso)+'/'+idTransaccion.value
            const response: AxiosResponse = await axios.patch(ruta, data)
            console.log(response)
            if (response.status === 200) notificaciones.notificarCorrecto('Item actualizado correctamente')
        } catch (error: any) {
            const errorApi = new ApiError(error)
            const mensajes: string[] = errorApi.erroresValidacion
            await notificarMensajesError(mensajes, notificaciones)
        } finally {
            statusLoading.desactivar()
        }

    }


    function resetearTransaccion() {
        transaccion.hydrate(transaccionReset)
    }

    async function actualizarComprobante(id: number, data) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.comprobantes) + '/' + id
            const response: AxiosResponse = await axios.put(url, data)
            statusLoading.desactivar()
            return response.data.modelo
        } catch (e: any) {
            const errorApi = new ApiError(e)
            const mensajes: string[] = errorApi.erroresValidacion
            notificarMensajesError(mensajes, notificaciones)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function firmarComprobante(id: number, data: any) {
        const modelo = await actualizarComprobante(id, data)
        if (modelo) {
            console.log('Se actualizó bien');

        }
    }

    /**
     * This is an async function that uses Axios to send a GET request to an API endpoint to cancel a
     * transaction and then hydrates the response data into a transaction object.
     */
    async function anularIngreso() {
        try {
            statusLoading.activar();
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.transacciones_ingresos) + '/anular/' + idTransaccion.value
            const response: AxiosResponse = await axios.get(ruta)
            // console.log(response.data)
            notificaciones.notificarCorrecto(response.data.mensaje)
            transaccion.hydrate(response.data.modelo)
        } catch (error) {
            notificarErrores(error)
        } finally {
            statusLoading.desactivar();
        }
    }

    async function anularEgreso() {
        // try {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.transacciones_egresos) + '/anular/' + idTransaccion.value
        const response: AxiosResponse = await axios.get(ruta)
        // console.log(response.data)
        notificaciones.notificarCorrecto(response.data.mensaje)
        transaccion.hydrate(response.data.modelo)

        // } catch (error) {
        //     notificaciones.notificarError('Ha ocurrido un error: '+error)
        // }
    }

    return {
        // State
        transaccion,
        accionTransaccion,
        tab,
        cargarTransaccion,
        resetearTransaccion,
        imprimirIngreso,
        imprimirEgreso,
        idTransaccion,
        showPreview,
        showPreviewEgreso,
        editarItemEgreso,
        firmarComprobante,
        anularIngreso,
        anularEgreso,
        imprimirActaEntregaRecepcion,
    }
})
