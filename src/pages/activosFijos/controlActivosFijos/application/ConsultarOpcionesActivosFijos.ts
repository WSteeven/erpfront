// Dependencias
import { ParamsType } from 'config/types'
import { Ref, ref } from 'vue'

// Logica y controladores
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export const useConsultarOpcionesActivosFijos = () => {
    /*************
     * Variables
     *************/
    const egresos: Ref<Transaccion[]> = ref([])
    const ingresos: Ref<Transaccion[]> = ref([])
    const axios = AxiosHttpRepository.getInstance()

    /************
     * Funciones
     ************/
    const listarEgresos = async (params: ParamsType) => {
        const ruta = axios.getEndpoint(endpoints.egresos_activos_fijos, params)
        const response: AxiosResponse = await axios.get(ruta)
        egresos.value = response.data.results
    }

    const listarIngresos = async (params: ParamsType) => {
        const { result } = await new TransaccionIngresoController().listar(params)
        ingresos.value = result
    }

    return {
        egresos,
        ingresos,
        listarEgresos,
        listarIngresos,
    }
}