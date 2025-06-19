import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Anticipo extends EntidadAuditable {
  id: number | null
  empleado: number | null
  fecha: string | null
  valor: number | null
  forma_pago: string | null
  forma_pago_info: string | null


  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.fecha = null
    this.valor = null
    this.forma_pago = null
    this.forma_pago_info = null
  }
}
