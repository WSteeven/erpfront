import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class EscenarioVentaJP extends EntidadAuditable {
  id: number | null
  mes: number | null
  apoyo_das_fijos: number | null
  vendedores: number | null
  productividad_minima: number | null
  vendedores_acumulados: number | null
  total_ventas_adicionales: number | null
  arpu_prom: number | null
  altas: number | null
  bajas: number | null
  neta: number | null
  stock: number | null
  stock_que_factura: number | null

  constructor() {
    super()
    this.id = null
    this.mes = null
    this.apoyo_das_fijos = null
    this.vendedores = null
    this.productividad_minima = null
    this.vendedores_acumulados = null
    this.total_ventas_adicionales = null
    this.arpu_prom = null
    this.altas = null
    this.bajas = null
    this.neta = null
    this.stock = null
    this.stock_que_factura = null
  }
}
