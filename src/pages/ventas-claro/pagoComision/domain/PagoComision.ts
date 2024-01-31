import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PagoComision extends EntidadAuditable {
  id: number | null
  rango_fecha: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  vendedor: number | null
  vendedor_id: number | null
  vendedor_info: string | null
  chargeback: number | null
  valor: number | null

  constructor() {
    super()
    this.id = null
    this.rango_fecha = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.vendedor = null
    this.vendedor_id = null
    this.vendedor_info = null
    this.chargeback = null
    this.valor = null
  }
}
