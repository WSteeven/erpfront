import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class AsignarAlimentacion extends EntidadAuditable {
  empleados: [] | null
  empleados_info: string | null
  valor_minimo: number | null
  fecha_corte: string | null
  constructor() {
    super()
    this.empleados = null
    this.empleados_info = null
    this.valor_minimo = null
    this.fecha_corte = null
  }
}
