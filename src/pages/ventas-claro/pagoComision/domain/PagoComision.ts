import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PagoComision extends EntidadAuditable {
  id: number | null
  mes: string | null
  vendedor: number | null
  vendedor_id:number | null
  vendedor_info: string | null
  chargeback: number |null
  valor:number | null

  constructor() {
    super()
    this.id = null
    this.mes = null
    this.vendedor = null
    this.vendedor_id = null
    this.vendedor_info = null
    this.chargeback = null
    this.valor = null
  }
}
