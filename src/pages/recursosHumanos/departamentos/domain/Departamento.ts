import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Departamento extends EntidadAuditable {
  id:number|null
  nombre: string | null
  activo: boolean
  responsable: string | number | null
  responsable_id: number | null

  constructor() {
    super()
    this.id = null
    this.nombre = null
    this.activo = true
    this.responsable = null
    this.responsable_id = null
  }
}
