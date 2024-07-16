import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class HorasExtrasSubTipo extends EntidadAuditable {
  nombre: string | null
  horas_extras: number | null

  constructor() {
    super()
    this.nombre = null
    this.horas_extras = null
  }
}
