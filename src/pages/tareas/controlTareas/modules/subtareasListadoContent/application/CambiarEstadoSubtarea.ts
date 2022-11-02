import { endpoints } from "config/api";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";

export class CambiarEstadoSubtarea {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    asignar(subtareaId: number) {
        try {
            const ruta = this.axios.getEndpoint(endpoints.subtareas) + 'asignar/' + subtareaId
            this.axios.post(ruta)
            console.log('Asignado')
        } catch (e: any) {
            //
        }
    }

    realizar(subtareaId: number) {
        try {
            const ruta = this.axios.getEndpoint(endpoints.subtareas) + 'realizar/' + subtareaId
            this.axios.post(ruta)
            console.log('Realizado')
        } catch (e: any) {
            //
        }
    }
}