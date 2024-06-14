import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { apiConfig, endpoints } from "config/api";
import { Conductor } from "pages/controlVehiculos/conductores/domain/Conductor";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { reactive, ref } from "vue";

export const useConductorStore = defineStore('conductor', () => {
    //State
    const conductor = reactive(new Conductor())
    const idConductor = ref()
    const accionMulta = ref('')
    const tabs = ref('formulario')
    const mostrarListado = ref(true)
    const idMulta = ref()
    const statusLoading = new StatusEssentialLoading()
    const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

    async function pagarMulta(data) {
        try {
            statusLoading.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.multas_conductores) + '/marcar-pagada/' + idMulta.value
            const response: AxiosResponse = await axios.post(url, data)
            if (response.status = 200) {
                notificarCorrecto(response.data.mensaje)
                return true
            }else notificarAdvertencia(response.data.mensaje)
        } catch (e) {
            notificarError('Error al marcar como pagada la multa. ' + e)
        } finally {
            statusLoading.desactivar()
        }
        return false
    }

    function resetearConductor(){
        conductor.hydrate(new Conductor())
    }

    return {
        conductor, idConductor, 
        accionMulta,
        tabs,
        mostrarListado,
        idMulta,

        resetearConductor,
        pagarMulta,
        
    }
})