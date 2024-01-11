import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Planes extends EntidadAuditable {
  nombre: number | null
  constructor() {
    super()
    this.nombre = null
  }
}
