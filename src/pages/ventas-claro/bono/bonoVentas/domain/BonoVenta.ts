import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BonoVentas extends EntidadAuditable {
  id: number | null
  cant_ventas: string | null
  valor: number | null
  constructor() {
    super()
    this.id = null
    this.cant_ventas = null
    this.valor = null
  }
}
