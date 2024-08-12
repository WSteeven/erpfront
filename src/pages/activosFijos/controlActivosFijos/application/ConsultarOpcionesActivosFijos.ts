// Dependencias
import { ParamsType } from 'config/types'
import { Ref, ref } from 'vue'

// Logica y controladores
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ActivoFijo } from '../domain/ActivoFijo'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export const useConsultarOpcionesActivosFijos = () => {
    /*************
     * Variables
     *************/
    const entregas: Ref<ActivoFijo[]> = ref([])
    const asignacionesProductos: Ref<ActivoFijo[]> = ref([])
    const seguimientosConsumosActivosFijos: Ref<any[]> = ref([])
    const axios = AxiosHttpRepository.getInstance()
    const { notificarInformacion, notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    /************
     * Funciones
     ************/
    const listarEntregas = async (params: ParamsType) => {
        try {
            cargando.activar()
            const ruta = axios.getEndpoint(endpoints.entregas_activos_fijos, params)
            const response: AxiosResponse = await axios.get(ruta)
            entregas.value = response.data.results
        } catch (e: any) {
            notificarError(e)
        } finally {
            cargando.desactivar()
        }
    }

    const listarStockResponsablesAF = async (params: ParamsType) => {
        try {
            const ruta = axios.getEndpoint(endpoints.stock_responsables_activos_fijos, params)
            const response: AxiosResponse = await axios.get(ruta)
            asignacionesProductos.value = response.data.results
        } catch (e: any) {
            notificarError(e)
        } finally {
            cargando.desactivar()
        }
    }

    const listarSeguimientoConsumoActivosFijos = async (params: ParamsType) => {
        try {
            const ruta = axios.getEndpoint(endpoints.seguimiento_consumo_activos_fijos, params)
            const response: AxiosResponse = await axios.get(ruta)
            seguimientosConsumosActivosFijos.value = response.data.results
            if (!seguimientosConsumosActivosFijos.value.length) notificarInformacion('Aún no se han registrado seguimientos.')
        } catch (e: any) {
            notificarError(e)
        } finally {
            cargando.desactivar()
        }
    }

    return {
        // Variables
        entregas,
        asignacionesProductos,
        seguimientosConsumosActivosFijos,
        // Funciones
        listarEntregas,
        listarStockResponsablesAF,
        listarSeguimientoConsumoActivosFijos,
    }
}