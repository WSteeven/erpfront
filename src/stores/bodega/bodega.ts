import { AxiosResponse } from 'axios';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { useNotificaciones } from 'shared/notificaciones';
import { notificarErrores } from 'shared/utils';
import { useNotificacionStore } from 'stores/notificacion';

export const useBodegaStore = defineStore('bodega', () => {
    const notificacionesStore = useNotificacionStore()
    notificacionesStore.setQuasar(useQuasar())

    const { notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()


    /*********************************
     * Funcione
     *********************************/
    async function consultarDashboard(data) {
        try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.dashboard_bodega)
            const response: AxiosResponse = await axios.post(url, data)
            // console.log(response.data.results)
            return response.data.results
        } catch (error) {
            notificarError('Error al consultar el dashboard ' + error)
            await notificarErrores(error)
        } finally { cargando.desactivar() }
    }

    return {
        consultarDashboard
    }

})