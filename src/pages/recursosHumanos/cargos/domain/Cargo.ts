import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Cargo extends EntidadAuditable {
  id: number | null
  nombre: string | null
  estado: boolean

  constructor() {
    super()
    this.id=null
    this.nombre = null
    this.estado = true
  }
}
