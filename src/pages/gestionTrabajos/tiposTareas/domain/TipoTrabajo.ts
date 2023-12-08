import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
/* import { CamposAdicionales } from './CamposAdicionales'
import { ImagenesAdicionales } from './ImagenesAdicionales' */

export class TipoTrabajo extends EntidadAuditable {
  cliente: number | null
  descripcion: string | null
  cliente_id: number | null
  activo: boolean

  constructor() {
    super()
    this.cliente = null
    this.descripcion = null
    this.cliente_id = null
    this.activo = true
  }
}
