import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'

export class CambiarEstadoTrabajo {
    axios: AxiosHttpRepository

    constructor() {
        this.axios = AxiosHttpRepository.getInstance()
    }

    async asignar(idTrabajo: number) {
        return this.solicitud('/asignar', idTrabajo)
    }

    async ejecutar(idTrabajo: number) {
        return this.solicitud('/ejecutar', idTrabajo)
    }

    async realizar(idTrabajo: number) {
        return this.solicitud('/realizar', idTrabajo)
    }

    async finalizar(idTrabajo: number) {
        return this.solicitud('/finalizar', idTrabajo)
    }

    async pausar(idTrabajo: number, mensaje: string) {
        return this.solicitud('/pausar', idTrabajo, { motivo: mensaje })
    }

    async reanudar(idTrabajo: number) {
        return this.solicitud('/reanudar', idTrabajo)
    }

    async suspender(idTrabajo: number, mensaje: string) {
        return this.solicitud('/suspender', idTrabajo, { motivo: mensaje })
    }

    async cancelar(idTrabajo: number, mensaje: string) {
        return this.solicitud('/cancelar', idTrabajo, { motivo: mensaje })
    }

    async reagendar(idTrabajo: number, nuevaFecha: string) {
        return this.solicitud('/reagendar', idTrabajo, { nueva_fecha: nuevaFecha })
    }

    async solicitud(accion, tarea, data?) {
        try {
            const ruta =
                this.axios.getEndpoint(endpoints.trabajos) + accion + '/' + tarea
            const response: AxiosResponse = await this.axios.post(ruta, data)

            return {
                response,
                result: response.data.modelo,
            }
        } catch (e: unknown) {
            const axiosError = e as AxiosError
            throw new ApiError(axiosError)
        }
    }
}
