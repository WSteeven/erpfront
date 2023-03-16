import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class GastoCoordinadores extends EntidadAuditable {
  fecha_gasto: Date | null
  lugar: string | null
  aut_especial: number | null
  aut_especial_user: string | null
   motivo: string | null
  cantidad: number | null
  valor_u: number | null
  total: number | null
  observacion: string | null
  id_usuario: number | null
  estado: string | null
  estado_info: string | null
  detalle_estado: string | null


  constructor() {
    super()
    this.fecha_gasto = null
    this.lugar = null
    this.aut_especial = null
    this.aut_especial_user = null
    this.motivo = null
    this.cantidad = null
    this.valor_u = null
    this.total = null
    this.observacion = null
    this.id_usuario = null
    this.estado = null
    this.estado_info = null
    this.detalle_estado = null

  }
}
