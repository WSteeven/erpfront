import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class DetalleFondo extends EntidadAuditable {
  descripcion: string | null
  autorizacion: string | null
  estatus: string | null
  id_estatus: number | null
  transcriptor: string | null
  fecha_trans: Date | null

  constructor() {
    super()
    this.descripcion = null
    this.autorizacion = null
    this.estatus = null
    this.id_estatus = null
    this.transcriptor = null
    this.fecha_trans = null

  }
}
