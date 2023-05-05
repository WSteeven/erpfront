import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PrestamoAnticipo extends EntidadAuditable {
  id: number | null
  tipo: string | null
  tipo_prestamo: string | null
  tipo_info: string | null
  fecha: string | null
  valor: number | null
  forma_pago: string | null
  forma_pago_info: string | null

  constructor() {
    super()
    this.id = null
    this.tipo_prestamo = null
    this.tipo = null
    this.tipo_info = null
    this.fecha = null
    this.valor = null
    this.forma_pago = null
    this.forma_pago_info = null
  }
}
