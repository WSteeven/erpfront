import { AxiosResponse } from 'axios';
import { endpoints } from 'config/api';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';

export class CambiarEstadoVendedor {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    async anular(id: number, data: any) {
        return this.solicitud('/desactivar/', id, data)
    }

    async solicitud(accion, id, data?) {
        const ruta = this.axios.getEndpoint(endpoints.vendedores_claro) + accion + id
        const response: AxiosResponse = await this.axios.post(ruta, data)
        return { response, result: response.data.modelo }
    }

    async  desactivarMasivo(){
        const ruta = this.axios.getEndpoint(endpoints.desactivar_vendedores_claro_masivo)
        const response : AxiosResponse = await this.axios.post(ruta)
        return { response, message: response.data.mensaje }

    }
}