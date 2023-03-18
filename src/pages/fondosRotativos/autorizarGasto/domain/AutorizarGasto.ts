import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class AutorizarGasto extends EntidadAuditable {
  usuario: number | null
  fecha_inicio: Date | null
  fecha_fin: Date | null
  fecha_viat: Date | null
  lugar: number | null
  num_tarea: string | null
  tarea_info: string | null
  proyecto: number | null
  proyecto_info: string | null
  ruc: string | null
  factura: string | null
  aut_especial: number | null
  aut_especial_user: string | null
  detalle: string | null
  detalle_info: string | null
  sub_detalle: string | null
  sub_detalle_info: string | null
  comprobante1: string | null
  comprobante2: string | null
  cantidad: number | null
  valor_u: number | null
  total: number | null
  observacion: string | null
  id_usuario: number | null
  estado: string | null
  estado_info: string | null
  detalle_estado: string | null
  constructor() {
    super()
    this.usuario = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.fecha_viat = null
    this.lugar = null
    this.num_tarea = null
    this.tarea_info = null
    this.proyecto = null
    this.proyecto_info = null
    this.ruc = null
    this.factura = null
    this.aut_especial = null
    this.aut_especial_user = null
    this.detalle = null
    this.detalle_info = null
    this.sub_detalle = null
    this.sub_detalle_info = null
    this.comprobante1 = null
    this.comprobante2 = null
    this.cantidad = null
    this.valor_u = null
    this.total = null
    this.observacion = null
    this.id_usuario = null
    this.estado = null
    this.estado_info = null
    this.detalle_estado = null
  }
}
