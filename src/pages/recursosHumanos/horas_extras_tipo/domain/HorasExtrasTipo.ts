import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class HorasExtrasTipo extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
