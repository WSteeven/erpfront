import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Umbral extends EntidadAuditable {
 empleado:number | null
  empleado_info: string | null
  empleado_id: number |  null
  valor_minimo: number | null
  referencia: number | null


  constructor() {
    super()
    this.empleado = null
    this.empleado_info =null
    this.empleado_id = null
    this.valor_minimo = null
    this.referencia = null

  }
}
