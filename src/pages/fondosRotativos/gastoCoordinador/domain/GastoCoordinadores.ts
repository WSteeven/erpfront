import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class GastoCoordinadores extends EntidadAuditable {
  fecha_gasto: Date | null
  lugar: string | null
   motivo: string | null
  monto: number | null
  observacion: string | null
  id_usuario: number | null


  constructor() {
    super()
    this.fecha_gasto = null
    this.lugar = null
    this.motivo = null
    this.monto = null
    this.observacion = null
    this.id_usuario = null
  }
}
