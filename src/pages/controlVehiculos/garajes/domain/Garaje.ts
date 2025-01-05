import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Garaje extends EntidadAuditable {
  nombre: string | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.activo = true
  }
}
