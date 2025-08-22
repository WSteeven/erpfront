import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Estado extends EntidadAuditable {
  nombre: string | null
  abreviatura: string | null
  tipo: string | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.abreviatura = null
    this.tipo = null
    this.activo = true
  }
}
