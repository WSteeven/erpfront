import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Banco extends EntidadAuditable {
  nombre: string | null
  codigo: string | null

  constructor() {
    super()
    this.nombre = null
    this.codigo = null
  }
}
