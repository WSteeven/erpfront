import { AxiosResponse } from 'axios';
import { endpoints } from 'config/api';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';

export class CambiarEstadoServicio {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    async anular(servicioId: number) {
        return this.solicitud('/anular/', servicioId)
    }
    async solicitud(accion, id, data?) {
        const ruta = this.axios.getEndpoint(endpoints.servicios) + accion + id
        const response: AxiosResponse = await this.axios.post(ruta, data)
        return {
            response, result: response.data.modelo
        }
    }
} 
