import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Consolidado extends EntidadAuditable {
  empleado: number | null
  tipo_saldo: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  constructor() {
    super()
    this.empleado = null
    this.tipo_saldo = null
    this.fecha_inicio = null
    this.fecha_fin = null
  }
}
