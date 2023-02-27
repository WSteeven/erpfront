import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CamposAdicionales extends EntidadAuditable {
  etiqueta: string | null
  tipo: string | null
  activo: boolean

  constructor() {
    super()
    this.etiqueta = null
    this.tipo = null
    this.activo = true
  }
}
