import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Canton extends EntidadAuditable {
  descripcion: string | null
  canton: string | null
  provincia: number | null

  constructor() {
    super()
    this.descripcion = null
    this.canton = null
    this.provincia = null
  }
}
