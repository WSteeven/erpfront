import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CuotaDescuento extends EntidadAuditable {
  num_cuota: number | null
  mes_vencimiento: string | null
  valor_cuota: number | null
  pagada: boolean
  comentario: string | null

  constructor() {
    super()
    this.num_cuota = null
    this.mes_vencimiento = null
    this.valor_cuota = null
    this.pagada = false
    this.comentario = null
  }
}
