import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CategoriaTipoTicket extends EntidadAuditable {
  nombre: string | null
  departamento: number | null
  departamento_id: number | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.departamento = null
    this.departamento_id = null
    this.activo = true
  }
}
