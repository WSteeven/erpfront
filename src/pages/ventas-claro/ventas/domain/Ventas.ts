import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Ventas extends EntidadAuditable {
  id:number  | null
  orden_id: string | null
  orden_interna: string | null
  vendedor: number | null
  vendedor_info: string | null
  producto: number | null
  producto_info: string | null
  producto_precio: number | null
  plan: string | null
  fecha_activ: string | null
  mes:string | null
  estado_activ: string | null
  forma_pago: string | null
  comision: number | null
  comision_info: string | null
  chargeback:number | null
  comision_vendedor: number | null
  constructor() {
    super()
    this.id = null
    this.orden_id = null
    this.orden_interna = null
    this.vendedor = null
    this.vendedor_info = null
    this.producto = null
    this.producto_info = null
    this.producto_precio = null
    this.plan = null
    this.fecha_activ = null
    this.mes = null
    this.estado_activ = null
    this.forma_pago = null
    this.comision = null
    this.comision_info = null
    this.chargeback = null
    this.comision_vendedor = null
  }
}
