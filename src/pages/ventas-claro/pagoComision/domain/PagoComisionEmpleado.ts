import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PagoComisionEmpleado extends EntidadAuditable {
  fecha_inicio: string | null
  fecha_fin: string | null
  corte_id: number | null
  corte_info: number | null
  vendedor_id: number | null
  vendedor_info: string | null
  tipo_vendedor: string | null
  ventas: number | null
  chargeback: string | null
  valor: string | null
  pagado: boolean

  constructor() {
    super()
    this.id = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.corte_id = null
    this.corte_info = null
    this.vendedor_id = null
    this.vendedor_info = null
    this.tipo_vendedor = null
    this.ventas = null
    this.chargeback = null
    this.valor = null
    this.pagado = false
  }
}
