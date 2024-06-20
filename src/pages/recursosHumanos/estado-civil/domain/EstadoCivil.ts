import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class EstadoCivil extends EntidadAuditable {
  nombre: string | null

  constructor() {
    super()
    this.nombre = null
  }
}
