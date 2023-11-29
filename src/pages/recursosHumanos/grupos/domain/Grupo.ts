import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Grupo extends EntidadAuditable {
  nombre: string | null
  coordinador: number | null
  activo: boolean
  region: string | null

  constructor() {
    super()
    this.nombre = null
    this.coordinador = null
    this.activo = true
    this.region = null
  }
}
