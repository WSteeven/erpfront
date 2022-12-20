import { AxiosResponse } from "axios";
import { endpoints } from "config/api";
import { ApiError } from "shared/error/domain/ApiError";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";

export class CambiarEstadoDevolucion {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    async anular(devolucionId: number, mensaje: string) {
        return this.solicitud('anular/', devolucionId, { motivo: mensaje })
    }

    async solicitud(accion, id, data?) {

        const ruta = this.axios.getEndpoint(endpoints.devoluciones) + accion + id
        const response: AxiosResponse = await this.axios.post(ruta, data)
        console.log(response)
        return {
            response,
            result: response.data.modelo,
        }
    }
}