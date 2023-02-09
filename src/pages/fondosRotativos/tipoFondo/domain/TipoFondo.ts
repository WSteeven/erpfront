import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class TipoFondo extends EntidadAuditable {
  descripcion: string | null
  transcriptor: string | null
  fecha_trans: Date | null

  constructor() {
    super()
    this.descripcion = null
    this.transcriptor = null
    this.fecha_trans = null
  }
}
