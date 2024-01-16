import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class DetalleAlimentacion extends EntidadAuditable {
  empleado:number | null
  empleado_info: string | null
  valor_asignado: number | null
  fecha_corte: string | null
  alimentacion_id: number | null
  masivo: boolean | null
  nuevo: boolean | null
  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.valor_asignado = null
    this.fecha_corte = null
    this.masivo = false
    this.alimentacion_id = null
    this.nuevo = false
  }
}
