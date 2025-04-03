import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { apiConfig, endpoints } from 'config/api'
import { acciones } from 'config/utils'
import { Prefactura } from 'pages/comprasProveedores/prefactura/domain/Prefactura'
import { defineStore } from 'pinia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { imprimirArchivo } from 'shared/utils'
import { reactive, ref } from 'vue'

export const usePrefacturaStore = defineStore('prefactura', () => {
    //State
    const prefactura = reactive(new Prefactura())
    const prefacturaReset = new Prefactura()
    const idPrefactura = ref()

    const { notificarAdvertencia, notificarError } = useNotificaciones()
    const accionPrefactura = acciones.nuevo
    const statusLoading = new StatusEssentialLoading()

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    async function imprimirPdf() {
        try {
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.prefacturas) + '/imprimir/' + idPrefactura.value
            const filename = 'prefactura_' + idPrefactura.value + '_' + Date.now()
            await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
            console.log('Prefactura impresa con éxito')
        } catch (e) {
            notificarAdvertencia('Error al imprimir la prefactura. ' + e)
        }
    }
    async function consultar() {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.prefacturas) + '/' + idPrefactura.value
            const response: AxiosResponse = await axios.get(url)
            prefactura.hydrate(response.data.modelo)
            return response
        } catch (e: any) {
            notificarError(e)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function anularPrefactura(data: any) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.prefacturas) + '/anular/' + idPrefactura.value
            const response: AxiosResponse = await axios.post(url, data)
            return response
        } catch (e: any) {
            notificarError(e)
        } finally {
            statusLoading.desactivar()
        }
    }

    function resetearprefactura() {
        prefactura.hydrate(prefacturaReset)
    }

    async function consultarDashboard(data) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.dashboard_ventas_empresa)
            const response: AxiosResponse = await axios.post(url, data)
            // console.log(response.data.results)
            return response.data.results
        } catch (error) {
            notificarError('Error al consultar el dashboard' + error)
        } finally {
            statusLoading.desactivar()
        }
    }
    async function buscarReporte(accion: string, data, listado) {
        try {
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.prefacturas) + '/reportes'
            const filename = 'reporte_prefacturas'
            switch (accion) {
                case 'excel':
                    data.accion = 'excel'
await                    imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
                    return listado
                case 'pdf':
                    data.accion = 'pdf'
                    await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
                    return listado
                default:
                    statusLoading.activar()
                    data.accion = ''
                    const response: AxiosResponse = await axios.post(url, data)
                    // console.log(response)
                    if (response.data.results) {
                        if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
                        return response.data.results
                    } else return listado
            }
        } catch (error) {
            console.log(error)
            notificarError('Error al obtener el reporte')
        } finally {
            statusLoading.desactivar()
        }
    }

    return {
        prefactura,
        accionPrefactura,
        idPrefactura,

        anularPrefactura,
        resetearprefactura,
        imprimirPdf,
        consultarDashboard,
        buscarReporte,
        consultar,

    }
})
