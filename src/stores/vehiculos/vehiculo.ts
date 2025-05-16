import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { AsignacionVehiculo } from 'pages/controlVehiculos/asignarVehiculos/domain/AsignacionVehiculo';
import { defineStore } from 'pinia';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { reactive, ref } from 'vue';

export const useVehiculoStore = defineStore('vehiculo', () => {
    //State
    // const idVehiculo = ref()
    const idMatricula = ref()
    const idAsignacion = ref()
    const asignacion = reactive(new AsignacionVehiculo())
    const asignacionReset = new AsignacionVehiculo()

    const statusLoading = new StatusEssentialLoading()
    const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()


    async function pagarMatricula(data) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.matriculas) + '/marcar-pagada/' + idMatricula.value
            const response: AxiosResponse = await axios.post(url, data)
            if (response.status == 200) {
                notificarCorrecto(response.data.mensaje)
                return true
            } else notificarAdvertencia(response.data.mensaje)
        } catch (e) {
            notificarError('Error al marcar como pagada la matrícula. ' + e)
        } finally {
            statusLoading.desactivar()
        }
        return false
    }

    async function setValorEstimadoPagar(data) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.matriculas) + '/registrar-estimado-pagar/' + idMatricula.value
            const response: AxiosResponse = await axios.post(url, data)
            if (response.status == 200) {
                notificarCorrecto(response.data.mensaje)
                return response.data.modelo
            } else notificarAdvertencia(response.data.mensaje)
        } catch (e) {
            notificarError('Error al ingresar valor estimado de pago de matrícula. ' + e)
        }
        finally {
            statusLoading.desactivar()
        }
    }

    /**
     *
     */
    function resetearAsignacionVehiculo() {
        asignacion.hydrate(asignacionReset)
    }

    return {
        idMatricula,

        setValorEstimadoPagar,
        pagarMatricula,

        idAsignacion,
        asignacion,
        resetearAsignacionVehiculo,
    }
})
