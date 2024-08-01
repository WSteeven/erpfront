// Dependencias
import { ParamsType } from 'config/types'
import { Ref, ref } from 'vue'

// Logica y controladores
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ActivoFijo } from '../domain/ActivoFijo'

export const useConsultarOpcionesActivosFijos = () => {
    /*************
     * Variables
     *************/
    const entregas: Ref<ActivoFijo[]> = ref([])
    const asignacionesProductos: Ref<ActivoFijo[]> = ref([])
    const axios = AxiosHttpRepository.getInstance()

    /************
     * Funciones
     ************/
    const listarEntregas = async (params: ParamsType) => {
        const ruta = axios.getEndpoint(endpoints.entregas_activos_fijos, params)
        const response: AxiosResponse = await axios.get(ruta)
        entregas.value = response.data.results
    }

    const listarAsignacionesProductos = async (params: ParamsType) => {
        const ruta = axios.getEndpoint(endpoints.asignaciones_productos, params)
        const response: AxiosResponse = await axios.get(ruta)
        asignacionesProductos.value = response.data.results
    }

    return {
        // Variables
        entregas,
        asignacionesProductos,
        // Funciones
        listarEntregas,
        listarAsignacionesProductos,
    }
}