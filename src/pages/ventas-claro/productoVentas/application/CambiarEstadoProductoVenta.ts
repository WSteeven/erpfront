import { AxiosResponse } from "axios";
import { endpoints } from "config/api";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";

export class CambiarEstadoProductoVenta {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    async anular(id: number) {
        return this.solicitud('/desactivar/', id)
    }

    async solicitud(accion, id, data?) {
        const ruta = this.axios.getEndpoint(endpoints.productos_ventas) + accion + id
        const response: AxiosResponse = await this.axios.post(ruta, data)
        return { response, result: response.data.modelo }
    }
}