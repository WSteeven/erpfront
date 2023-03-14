import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export class CambiarEstadoSubtarea {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async asignar(idTrabajo: number) {
    return this.solicitud('/asignar', idTrabajo)
  }

  async agendar(idTrabajo: number) {
    return this.solicitud('/agendar', idTrabajo)
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

  async pausar(idTrabajo: number, idMotivoPausa: number) {
    return this.solicitud('/pausar', idTrabajo, { motivo_pausa_id: idMotivoPausa })
  }

  async reanudar(idTrabajo: number) {
    return this.solicitud('/reanudar', idTrabajo)
  }

  async suspender(idTrabajo: number, idMotivoSuspendido: number) {
    return this.solicitud('/suspender', idTrabajo, { motivo_suspendido_id: idMotivoSuspendido })
  }

  async pendiente(idTrabajo: number, idMotivoPendiente: string) {
    return this.solicitud('/pendiente', idTrabajo, { motivo_pendiente_id: idMotivoPendiente })
  }

  async cancelar(idTrabajo: number, idMotivoCancelado: number) {
    return this.solicitud('/cancelar', idTrabajo, { motivo_suspendido_id: idMotivoCancelado }) // Correcto: es motivo_suspendido_id
  }

  async reagendar(idTrabajo: number, nuevaFecha: string) {
    return this.solicitud('/reagendar', idTrabajo, { nueva_fecha: nuevaFecha })
  }

  async solicitud(accion, tarea, data?) {
    const cargando = new StatusEssentialLoading()

    try {
      const ruta =
        this.axios.getEndpoint(endpoints.subtareas) + accion + '/' + tarea

      cargando.activar()
      const response: AxiosResponse = await this.axios.post(ruta, data)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (e: unknown) {
      const axiosError = e as AxiosError
      throw new ApiError(axiosError)
    } finally {
      cargando.desactivar()
    }
  }
}
