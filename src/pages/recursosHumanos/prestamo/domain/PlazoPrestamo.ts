import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PlazoPrestamo extends EntidadAuditable {
  num_cuota: number | null
  fecha_pago: string | null
  valor_a_pagar: number | null
  pago_couta:boolean |null

  constructor() {
    super()
    this.num_cuota = null
    this.fecha_pago = null
    this.valor_a_pagar = null
    this.pago_couta = false
  }
}
