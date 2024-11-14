import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Descuento extends EntidadAuditable {
  fecha_descuento: string | null
  empleado: string | null
  tipo_descuento: string | null
  multa: string | null
  descripcion: string | null
  valor: string | null
  cantidad_cuotas: string | null
  mes_inicia_cobro: string | null
  pendiente_pagar: string | null
  pagado: boolean
  cuotas: []

  constructor() {
    super()
    this.fecha_descuento = null
    this.empleado = null
    this.multa= null
    this.tipo_descuento = null
    this.descripcion = null
    this.valor = null
    this.cantidad_cuotas = null
    this.mes_inicia_cobro = null
    this.pendiente_pagar = null
    this.pagado = false
    this.cuotas = []
  }
}
