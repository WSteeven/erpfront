import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class SubDetalleFondo extends EntidadAuditable {
  detalle_viatico: string | null
  descripcion: string | null
  sub_detalle: string | null
  transcriptor: string | null
  fecha_trans: Date | null
  autorizacion: string | null
  estatus: string | null

  constructor() {
    super()
    this.detalle_viatico = null
    this.descripcion = null
    this.sub_detalle = null
    this.transcriptor=null
    this.fecha_trans = null
    this.autorizacion = null
    this.estatus = null

  }
}
