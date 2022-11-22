import { endpoints } from "config/api";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"

export class CambiarEstadoSubtarea {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    asignar(subtareaId: number) {
        this.solicitud('asignar', subtareaId)
    }

    ejecutar(subtareaId: number) {
        this.solicitud('ejecutar', subtareaId)
    }

    realizar(subtareaId: number) {
        this.solicitud('realizar', subtareaId)
    }

    pausar(subtareaId: number, mensaje: string) {
        this.solicitud('pausar', subtareaId, { motivo: mensaje })
    }

    reanudar(subtareaId: number) {
        this.solicitud('reanudar', subtareaId)
    }

    suspender(subtareaId: number) {
        this.solicitud('suspender', subtareaId)
    }

    solicitud(accion, subtarea, data?) {
        try {
            const ruta = this.axios.getEndpoint(endpoints.subtareas) + accion + '/' + subtarea
            this.axios.post(ruta, data)
        } catch (e: any) {
            //
        }
    }
}