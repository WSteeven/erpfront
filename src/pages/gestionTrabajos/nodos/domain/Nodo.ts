import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Nodo extends EntidadAuditable {
  grupos: any
  coordinador: string | null
  nombre: string | null
  activo: boolean

  constructor() {
    super()
    this.grupos = []
    this.coordinador = null
    this.nombre = null
    this.activo = true
  }
}
