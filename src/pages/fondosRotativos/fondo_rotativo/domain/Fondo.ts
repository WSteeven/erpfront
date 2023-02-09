import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Fondo extends EntidadAuditable {
  fecha_viat: Date | null
  lugar: number | null
  num_tarea: string | null
  RUC: string | null
  factura: string | null
  aut_especial: string | null
  detalle: string | null
  sub_detalle: string | null
  comprobante: string | null
  comprobante2: string | null
  cantidad: number | null
  valor_u: number | null
  total: number | null
  observacion: string | null
  id_usuario: number | null
  estado: string | null
  detalle_estado: string | null
  fecha_ingreso: Date | null
  transcriptor: string | null


  constructor() {
    super()
    this.fecha_viat = null
    this.lugar = null
    this.num_tarea = null
    this.RUC = null
    this.factura = null
    this.aut_especial = null
    this.detalle = null
    this.sub_detalle = null
    this.comprobante = null
    this.comprobante2 = null
    this.cantidad = null
    this.valor_u = null
    this.total = null
    this.observacion = null
    this.id_usuario = null
    this.estado = null
    this.detalle_estado = null
    this.fecha_ingreso = null
    this.transcriptor = null

  }
}
