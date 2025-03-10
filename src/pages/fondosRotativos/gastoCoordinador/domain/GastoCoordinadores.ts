import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class GastoCoordinadores extends EntidadAuditable {
  fecha_gasto: Date | null
  lugar: string | null
  grupo: string | null
  lugar_info: string | null
   motivo: string | null
  motivo_info: string | null
  monto: number | null
  observacion: string | null
  id_usuario: number | null
  empleado_info: string | null
  revisado: boolean
  estado : number|null
  observacion_contabilidad: string | null


  constructor() {
    super()
    this.fecha_gasto = null
    this.lugar = null
    this.grupo = null
    this.lugar_info = null
    this.motivo = null
    this.motivo_info = null
    this.monto = null
    this.observacion = null
    this.id_usuario = null
    this.empleado_info = null
    this.revisado = false
    this.estado = null
    this.observacion_contabilidad = null
  }
}
