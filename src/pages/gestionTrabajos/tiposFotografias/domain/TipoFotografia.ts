import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoFotografia extends EntidadAuditable {
  nombre: string | null
  tipo_trabajo: number | null

  activo: boolean | null

  constructor() {
    super()
    this.nombre = null
    this.tipo_trabajo = null
    this.activo = true
  }
}
