import { AxiosResponse } from "axios"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { apiConfig, endpoints } from "config/api"
import { acciones } from "config/utils"
import { Proforma } from "pages/comprasProveedores/proforma/domain/Proforma"
import { defineStore } from "pinia"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { useNotificaciones } from "shared/notificaciones"
import { imprimirArchivo } from "shared/utils"
import { reactive, ref } from "vue"

export const useProformaStore = defineStore('proforma', () => {
    //State
    const proforma = reactive(new Proforma())
    const proformaReset = new Proforma()
    const idProforma = ref()

    const { notificarAdvertencia, notificarError } = useNotificaciones()
    const accionProforma = acciones.nuevo
    const statusLoading = new StatusEssentialLoading()

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    async function imprimirPdf() {
        try {
            statusLoading.activar
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.proformas) + '/imprimir/' + idProforma.value
            const filename = 'proforma_' + idProforma.value + '_' + Date.now()
            imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
            console.log('Proforma impresa con éxito')
        } catch (e) {
            notificarAdvertencia('Error al imprimir la proforma. ' + e)
        } finally {
            statusLoading.desactivar()
        }
    }

    async function anularProforma(data: any) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.proformas) + '/anular/' + idProforma.value
            const response: AxiosResponse = await axios.post(url, data)
            return response
        } catch (e: any) {
            notificarError(e)
        } finally {
            statusLoading.desactivar()
        }
    }

    function resetearproforma() {
        proforma.hydrate(proformaReset)
    }

    return {
        proforma,
        accionProforma,
        idProforma,

        anularProforma,
        resetearproforma,
        imprimirPdf,
    }
})