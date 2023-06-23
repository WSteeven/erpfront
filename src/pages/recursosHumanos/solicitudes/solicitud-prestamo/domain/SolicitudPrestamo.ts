import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class SolicitudPrestamo extends EntidadAuditable {
  id: number | null
  solicitante: number | null
  solicitante_info: string |null
  fecha: string | null
  monto: number | null
  plazo: number | null
  estado: number |null
  estado_info: string|null
  observacion: string | null

  constructor() {
    super()
    this.id = null
    this.solicitante = null
    this.solicitante_info = null
    this.fecha = null
    this.monto = null
    this.plazo = null
    this.estado = null
    this.estado_info= null
    this.observacion = null
  }
}
