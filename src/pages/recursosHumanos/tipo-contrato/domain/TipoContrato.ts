import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class TipoContrato extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
