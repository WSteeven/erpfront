import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Chargeback extends EntidadAuditable {
  id: number | null
  venta_id: number | null
  venta: number | null
  venta_info: string | null
  fecha: string | null
  valor: string | null
  id_tipo_chargeback: number | null
  tipo_chargeback: number | null
  tipo_chargeback_info: string | null
  porcentaje: number | null

  constructor() {
    super()
    this.id = null
    this.venta_id = null
    this.venta = null
    this.venta_info = null
    this.fecha = null
    this.valor = null
    this.id_tipo_chargeback = null
    this.tipo_chargeback = null
    this.tipo_chargeback_info = null
    this.porcentaje = null
  }
}
