import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class DetalleFondo extends EntidadAuditable {
  descripcion: string | null
  autorizacion: string | boolean | null
  estatus: string | boolean | null
  id_estatus: number | null
  transcriptor: string | null
  fecha_trans: Date | null

  constructor() {
    super()
    this.descripcion = null
    this.autorizacion = 'SI'
    this.estatus = 'ACTIVO'
    this.id_estatus = null
    this.transcriptor = null
    this.fecha_trans = null

  }
}
