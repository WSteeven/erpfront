import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Valija extends EntidadAuditable {
  gasto_id: number | null
  gasto: string | number | null
  empleado_id: number | null
  empleado: string | null
  departamento: string | number | null
  descripcion: string | number | null
  destinatario: string | number | null
  imagen_evidencia: string | null

  constructor() {
    super()
    this.gasto_id = null
    this.gasto = null
    this.empleado_id = null
    this.empleado = null
    this.departamento = null
    this.descripcion = null
    this.destinatario = null
    this.imagen_evidencia = null
  }
}
