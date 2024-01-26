import { AxiosResponse } from "axios";
import { endpoints } from "config/api";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";

export class CambiarEstadoEtapa {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async desactivar(etapaId: number, mensaje: string) {
    return this.solicitud('/desactivar/', etapaId, { motivo: mensaje })
  }

  async solicitud(accion:string, id:number, data?) {
    const ruta = this.axios.getEndpoint(endpoints.etapas) + accion + id
    const response: AxiosResponse = await this.axios.post(ruta, data)
    return {
      response,
      result: response.data.modelo
    }
  }
}
