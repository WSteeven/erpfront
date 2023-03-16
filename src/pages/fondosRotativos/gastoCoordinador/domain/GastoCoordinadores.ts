import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class GastoCoordinadores extends EntidadAuditable {
  fecha_gasto: Date | null
  lugar: string | null
   motivo: string | null
  monto: number | null
  observacion: string | null
  id_usuario: number | null
  estado: string | null
  estado_info: string | null
  detalle_estado: string | null


  constructor() {
    super()
    this.fecha_gasto = null
    this.lugar = null
    this.motivo = null
    this.monto = null
    this.observacion = null
    this.id_usuario = null
    this.estado = null
    this.estado_info = null
    this.detalle_estado = null

  }
}
