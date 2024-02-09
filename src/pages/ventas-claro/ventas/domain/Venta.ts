import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Venta extends EntidadAuditable {
  id: number | null
  orden_id: string | null
  orden_interna: string | null
  vendedor: number | null
  vendedor_info: string | null
  cliente: number | null
  cliente_info: string | null
  producto: number | null
  producto_info: string | null
  producto_precio: number | null
  plan: string | null
  fecha_activacion: string | null
  mes: string | null
  estado_activacion: string | null
  forma_pago: string | null
  comisiona: boolean
  comision: number | null
  comision_info: string | null
  chargeback: number | null
  comision_vendedor: number | null
  activo: boolean
  observacion: string | null
  primer_mes: boolean
  novedades: number | null


  constructor() {
    super()
    this.id = null
    this.orden_id = null
    this.orden_interna = null
    this.vendedor = null
    this.vendedor_info = null
    this.cliente = null
    this.cliente_info = null
    this.producto = null
    this.producto_info = null
    this.producto_precio = null
    this.plan = null
    this.fecha_activacion = null
    this.mes = null
    this.estado_activacion = null
    this.forma_pago = null
    this.comisiona = false
    this.comision = null
    this.comision_info = null
    this.chargeback = null
    this.comision_vendedor = null
    this.activo = true
    this.observacion = null
    this.primer_mes = false
    this.novedades = 0
  }
}