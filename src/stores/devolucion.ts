import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Devolucion } from 'pages/bodega/devoluciones/domain/Devolucion'
import { apiConfig, endpoints } from 'config/api'
import { AxiosError, AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { acciones, estadosTransacciones } from 'config/utils'
import { imprimirArchivo, isAxiosError, notificarMensajesError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'

import TransaccionIngresoPage from 'pages/bodega/transacciones/modules/transaccionIngreso/view/TransaccionIngresoPage'
import { ApiError } from 'shared/error/domain/ApiError'
import { DevolucionController } from 'pages/bodega/devoluciones/infraestructure/DevolucionController'

export const useDevolucionStore = defineStore('devolucion', () => {
    //State
    const devolucion = reactive(new Devolucion())
    const devolucionReset = new Devolucion()
    const idDevolucion = ref()

    const { notificarAdvertencia, notificarError } = useNotificaciones()


    const accionDevolucion = acciones.nuevo

    const statusLoading = new StatusEssentialLoading()

    async function consultar(id: number) {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.devoluciones) + '/' + id
        const response: AxiosResponse = await axios.get(ruta)
        if (response.data.modelo.estado === 'CREADA') {
            return response.data.modelo
        } else {
            notificarAdvertencia('No se puede gestionar una devolución anulada')
        }
    }

    async function cargarDevolucion(id: number) {
        try {
            statusLoading.activar()
            const modelo = await consultar(id)
            console.log(modelo)
            if (modelo.autorizacion == 2) {
                if (modelo.estado_bodega === estadosTransacciones.pendiente || modelo.estado_bodega === estadosTransacciones.parcial)
                    devolucion.hydrate(modelo)
                else {
                    notificarAdvertencia('La devolución ya ha sido completada')
                    devolucion.hydrate(devolucionReset)
                }
            } else {
                notificarAdvertencia('La devolución no está aprobada')
                devolucion.hydrate(devolucionReset)
            }
        } catch (e) {
            notificarError('Devolución no encontrada')
            devolucion.hydrate(devolucionReset)

        } finally {
            statusLoading.desactivar()
        }
    }

    async function showPreview() {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.devoluciones) + '/show-preview/' + idDevolucion.value
        const response: AxiosResponse = await axios.get(ruta)
        devolucion.hydrate(response.data.modelo)
    }
    async function imprimirPdf() {
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.devoluciones) + '/imprimir/' + idDevolucion.value
        const filename = 'devolucion_' + idDevolucion.value + '_' + Date.now()
        imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    function resetearDevolucion() {
        devolucion.hydrate(devolucionReset)
    }

    return {
        devolucion,
        accionDevolucion,
        cargarDevolucion,
        resetearDevolucion,
        idDevolucion,
        showPreview,
        imprimirPdf,

    }
})
