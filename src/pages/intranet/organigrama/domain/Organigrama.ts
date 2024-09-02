import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Organigrama extends EntidadAuditable {
  id: number | null
  empleado_id: number | null
  cargo: string | null
  cargo_id: number | null
  tipo: string | null
  departamento: string | null
  nivel: number | null
  jefe_id: number | null

  constructor() {
    super()
    this.id = null
    this.empleado_id = null
    this.cargo = ''
    this.cargo_id = null
    this.tipo = null
    this.departamento = null
    this.nivel = null
    this.jefe_id = null
  }
}
