import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class SubDetalleFondo extends EntidadAuditable {
  descripcion: string | null
  autorizacion: string | null
  estatus: string | null

  constructor() {
    super()
    this.descripcion = null
    this.autorizacion = null
    this.estatus = null

  }
}
