import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class AsignarAlimentacion extends EntidadAuditable {
  empleado:number | null
  empleado_info: string | null
  valor_minimo: number | null
  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.valor_minimo = null
  }
}
