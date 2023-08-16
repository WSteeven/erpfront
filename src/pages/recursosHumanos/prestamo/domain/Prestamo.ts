import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Prestamo extends EntidadAuditable {
  id: number | null
  solicitante: number | null
  solicitante_info: string | null
  fecha: string | null
  vencimiento: string | null
  periodo: number | null
  valor_utilidad: number |null
  monto: number | null
  plazo
  plazos: any[] | null

  constructor() {
    super()
    this.id = null
    this.solicitante = null
    this.solicitante_info = null
    this.fecha = null
    this.vencimiento = null
    this.periodo = null
    this.valor_utilidad = null
    this.monto = null
    this.plazo = null
    this.plazos = null
  }
}
