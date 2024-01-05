import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Alimentacion extends EntidadAuditable {
  empleado:number | null
  empleado_info: string | null
  valor_asignado: number | null
  fecha_corte: string | null
  masivo: boolean | null
  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.valor_asignado = null
    this.fecha_corte = null
    this.masivo = null
  }
}
