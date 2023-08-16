import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CausaIntervencion extends EntidadAuditable {
  nombre: string | null
  // cliente: number | null
  tipo_trabajo: number | null
  tipo_trabajo_id: number | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    // this.cliente = null
    this.tipo_trabajo = null
    this.tipo_trabajo_id = null
    this.activo = true
  }
}
