import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UnwrapRef } from 'vue'

export class CambiarEstadoSubtarea {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async asignar(idSubtarea: number) {
    return this.solicitud('/asignar', idSubtarea)
  }

  async agendar(idSubtarea: number) {
    return this.solicitud('/agendar', idSubtarea)
  }

  async ejecutar(idSubtarea: number, data: UnwrapRef<any>) {
    return this.solicitud('/ejecutar', idSubtarea, data)
  }

  async realizar(idSubtarea: number) {
    return this.solicitud('/realizar', idSubtarea)
  }

  async finalizar(idSubtarea: number) {
    return this.solicitud('/finalizar', idSubtarea)
  }

  async pausar(idSubtarea: number, idMotivoPausa: number) {
    return this.solicitud('/pausar', idSubtarea, { motivo_pausa_id: idMotivoPausa })
  }

  async reanudar(idSubtarea: number) {
    return this.solicitud('/reanudar', idSubtarea)
  }

  async corregir(idSubtarea: number) {
    return this.solicitud('/corregir', idSubtarea)
  }

  async suspender(idSubtarea: number, idMotivoSuspendido: number) {
    return this.solicitud('/suspender', idSubtarea, { motivo_suspendido_id: idMotivoSuspendido })
  }

  async pendiente(idSubtarea: number, idMotivoPendiente: string) {
    return this.solicitud('/pendiente', idSubtarea, { motivo_pendiente_id: idMotivoPendiente })
  }

  async cancelar(idSubtarea: number, idMotivoCancelado: number) {
    return this.solicitud('/cancelar', idSubtarea, { motivo_suspendido_id: idMotivoCancelado }) // Correcto: es motivo_suspendido_id
  }

  async reagendar(idSubtarea: number, nuevaFecha: string) {
    return this.solicitud('/reagendar', idSubtarea, { nueva_fecha: nuevaFecha })
  }

  async solicitud(accion, tarea, data?: UnwrapRef<any>) {
    const cargando = new StatusEssentialLoading()

    try {
      const ruta =
        this.axios.getEndpoint(endpoints.subtareas) + accion + '/' + tarea

      cargando.activar()
      console.log(data)
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
