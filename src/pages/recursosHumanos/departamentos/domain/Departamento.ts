import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Departamento extends EntidadAuditable {
  nombre: string | null
  activo: boolean
  responsable: number | null

  constructor() {
    super()
    this.nombre = null
    this.activo = true
    this.responsable = null
  }
}
