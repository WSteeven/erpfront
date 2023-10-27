import { AxiosResponse } from "axios";
import { endpoints } from "config/api";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";


export class CambiarEstadoPedido {
  axios: AxiosHttpRepository

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async marcarCompletado(pedidoId:number, mensaje){
    return this.solicitud('/marcar-completado/', pedidoId, {motivo: mensaje})
  }

  async anular(pedidoId: number, mensaje: string) {
    return this.solicitud('/anular/', pedidoId, { motivo: mensaje })
  }

  async solicitud(accion, id, data?) {
    const ruta = this.axios.getEndpoint(endpoints.pedidos) + accion + id
    const response: AxiosResponse = await this.axios.post(ruta, data)
    return {
      response, result: response.data.modelo
    }
  }
}
