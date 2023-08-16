import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PlazoPrestamo extends EntidadAuditable {
  id:number |null
  num_cuota: number | null
  fecha_vencimiento:string | null
  fecha_pago: string | null
  valor_couta: string | null
  valor_pagado: string | null
  valor_a_pagar: number | null
  pago_couta:boolean |null

  constructor() {
    super()
    this.id = null
    this.num_cuota = null
    this.fecha_vencimiento = null
    this.fecha_pago = null
    this.valor_couta = null
    this.valor_pagado = null
    this.valor_a_pagar = null
    this.pago_couta = false
  }
}
