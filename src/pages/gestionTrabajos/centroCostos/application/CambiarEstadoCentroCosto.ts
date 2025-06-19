import { AxiosResponse } from 'axios';
import { endpoints } from 'config/api';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';

export class CambiarEstadoCentroCosto {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    async anular(centroId: number) {
        return this.solicitud('/desactivar/', centroId)
    }

    async solicitud(accion, id, data?) {
        const ruta = this.axios.getEndpoint(endpoints.centros_costos) + accion + id
        const response: AxiosResponse = await this.axios.post(ruta, data)
        return { response, result: response.data.modelo }
    }
}