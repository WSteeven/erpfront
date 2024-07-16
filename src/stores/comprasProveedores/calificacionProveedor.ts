import { AxiosResponse } from 'axios';
import { endpoints } from 'config/api';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { ref } from 'vue';

export const useCalificacionProveedorStore = defineStore('calificacion', () => {
    //State
    const calificacion = ref()
    const idDepartamento = ref()
    const idProveedor = ref()
    const idDetalleDepartamentoProveedor = ref()
    const detalleDepartamentoProveedor: any = ref()
    const departamentosCalificadoresProveedor: any = ref([]) //el/los departamentos que califican al proveedor
    const verMiCalificacion = ref(false)

    /**
     * La función 'consultarDepartamentosCalificanProveedor' recupera el detalle de los departamentos
     * que califican a un proveedor.
     */
    async function consultarDepartamentosCalificanProveedor() {
        const axios = AxiosHttpRepository.getInstance()
        const url = axios.getEndpoint(endpoints.detalles_departamentos_proveedor) + '?proveedor_id=' + idProveedor.value
        const response: AxiosResponse = await axios.get(url)
        departamentosCalificadoresProveedor.value = response.data.results
    }
    /**
     * La función 'consultarCalificacionMiDepartamento' recupera los detalles de un departamento de un
     * proveedor y asigna los resultados a una variable.
     */
    async function consultarCalificacionMiDepartamento() {
        console.log('STORE: ', idProveedor.value, idDepartamento.value)
        if (detalleDepartamentoProveedor.value.id == (null || undefined)) {
            console.log('entro en el if')
            const axios = AxiosHttpRepository.getInstance()
            const url = axios.getEndpoint(endpoints.detalles_departamentos_proveedor) + '?proveedor_id=' + idProveedor.value + '&departamento_id=' + idDepartamento.value
            const response: AxiosResponse = await axios.get(url)
            departamentosCalificadoresProveedor.value = response.data.results
        } else {
            console.log('entro en el else')
            departamentosCalificadoresProveedor.value.push(detalleDepartamentoProveedor.value)
        }
    }

    /**
     * La función `consultarCalificacionesProveedorDepartamento` es una función asíncrona que recupera
     * las calificaciones de un proveedor en base a un ID de departamento.
     * @param {number} departamento_id - El parámetro `departamento_id` es el ID del departamento para
     * el que desea recuperar las calificaciones de los proveedores.
     * @returns los resultados de la llamada API para recuperar las calificaciones de un proveedor en
     * un departamento específico.
     */
    async function consultarCalificacionesProveedorDepartamento(departamento_id: number) {
        const axios = AxiosHttpRepository.getInstance()
        const url = axios.getEndpoint(endpoints.calificacion_proveedor) + '?detalle_departamento_id=' + departamento_id
        const response: AxiosResponse = await axios.get(url)
        return response.data.results
    }

    return {
        calificacion,
        idDepartamento,
        idProveedor,
        idDetalleDepartamentoProveedor,
        detalleDepartamentoProveedor,
        departamentosCalificadoresProveedor,
        verMiCalificacion,

        //funciones
        consultarDepartamentosCalificanProveedor,
        consultarCalificacionesProveedorDepartamento,
        consultarCalificacionMiDepartamento,
    }
})
