import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { AxiosError, AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UnwrapRef } from 'vue'

export class CambiarEstadoSubtarea {
  axios: AxiosHttpRepository
  cargando = new StatusEssentialLoading()

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async asignar(idSubtarea: number) {
    return await this.solicitud('/asignar', idSubtarea)
  }

  async agendar(idSubtarea: number) {
    return await this.solicitud('/agendar', idSubtarea)
  }

  async ejecutar(idSubtarea: number, data: UnwrapRef<any>) {
    return this.solicitud('/ejecutar', idSubtarea, data)
  }

  async realizar(idSubtarea: number, movilizacion: any) {
    return this.solicitud('/realizar', idSubtarea, movilizacion)
  }

  async finalizar(idSubtarea: number, data: any) {
    return this.solicitud('/finalizar', idSubtarea, data)
  }

  async pausar(idSubtarea: number, movilizacion: any) {
    return this.solicitud('/pausar', idSubtarea, movilizacion)
  }

  async reanudar(idSubtarea: number, movilizacion: any) {
    return this.solicitud('/reanudar', idSubtarea, movilizacion)
  }

  async corregir(idSubtarea: number) {
    return this.solicitud('/corregir', idSubtarea)
  }

  async suspender(idSubtarea: number, movilizacion: any,) {
    return this.solicitud('/suspender', idSubtarea, movilizacion)
  }

  async pendiente(idSubtarea: number, idMotivoPendiente: string) {
    return this.solicitud('/pendiente', idSubtarea, { motivo_pendiente_id: idMotivoPendiente })
  }

  async cancelar(idSubtarea: number, idMotivoCancelado: number) {
    return this.solicitud('/cancelar', idSubtarea, { motivo_suspendido_id: idMotivoCancelado }) // Correcto: es motivo_suspendido_id
  }

  async reagendar(idSubtarea: number, nuevaFecha: string) {
    return await this.solicitud('/reagendar', idSubtarea, { nueva_fecha: nuevaFecha })
  }

  async solicitud(accion, tarea, data?: UnwrapRef<any>) {
    this.cargando.activar()

    try {
      const ruta =
        this.axios.getEndpoint(endpoints.subtareas) + accion + '/' + tarea

      const response: AxiosResponse = await this.axios.post(ruta, data)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (e: unknown) {
      const axiosError = e as AxiosError
      throw new ApiError(axiosError)
    } finally {
      this.cargando.desactivar()
    }
  }
}
