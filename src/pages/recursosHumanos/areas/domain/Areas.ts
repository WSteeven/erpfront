import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Areas extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
