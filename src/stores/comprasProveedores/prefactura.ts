import { AxiosResponse } from "axios"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { apiConfig, endpoints } from "config/api"
import { acciones, autorizacionesTransacciones } from "config/utils"
import { Prefactura } from "pages/comprasProveedores/prefactura/domain/Prefactura"
import { defineStore } from "pinia"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { useNotificaciones } from "shared/notificaciones"
import { imprimirArchivo } from "shared/utils"
import { reactive, ref } from "vue"

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
            statusLoading.activar
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.prefacturas) + '/imprimir/' + idPrefactura.value
            const filename = 'prefactura_' + idPrefactura.value + '_' + Date.now()
            imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
            console.log('Prefactura impresa con éxito')
        } catch (e) {
            notificarAdvertencia('Error al imprimir la prefactura. ' + e)
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

    return {
        prefactura,
        accionPrefactura,
        idPrefactura,

        anularPrefactura,
        resetearprefactura,
        imprimirPdf,
        consultarDashboard,

    }
})