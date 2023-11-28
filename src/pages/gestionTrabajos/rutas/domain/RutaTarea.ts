import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RutaTarea extends EntidadAuditable {
  cliente: number | null
  ruta: string | null
  cliente_id: number | null
  activo: boolean

  constructor() {
    super()
    this.cliente = null
    this.ruta = null
    this.cliente_id = null
    this.activo = true
  }
}
