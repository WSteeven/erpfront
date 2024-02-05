import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { PagoComision } from 'pages/ventas-claro/pagoComision/domain/PagoComision';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { imprimirArchivo, notificarMensajesError } from 'shared/utils';
import { reactive, ref } from 'vue';

export const usePagaComisionStore = defineStore('cortes-comisiones', () => {
    const corte = reactive(new PagoComision())
    const corteReset = new PagoComision()
    const idCorte = ref()

    const { notificarCorrecto, notificarAdvertencia, notificarError, confirmar } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    async function obtenerFechasDisponiblesCortes() {
        try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/api/ventas-claro/obtener-fechas-disponbles-cortes'
            const response: AxiosResponse = await axios.get(url)

            return response.data.results
        } catch (error: any) {
            notificarError(error)
        } finally {
            cargando.desactivar()
        }

    }

    async function imprimirExcel() {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.cortes_pagos_comisiones) + '/imprimir-excel/' + idCorte.value
        imprimirArchivo(url, 'GET', 'blob', 'xlsx', corte.nombre || 'reporte_' + Date.now())
        cargando.desactivar()
    }

    async function anularCorte(data: any) {
        try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.cortes_pagos_comisiones) + '/anular/' + idCorte.value
            const response: AxiosResponse = await axios.post(url, data)
            return response
        } catch (error: any) {
            notificarError(error)
        } finally {
            cargando.desactivar()
        }
    }



    return {
        corte, idCorte, corteReset,

        obtenerFechasDisponiblesCortes,
        imprimirExcel,
        anularCorte,
    }
})