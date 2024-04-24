import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ActividadFisica extends EntidadAuditable {
  nombre: string | null
  tiempo: number | null

  constructor() {
    super()
    this.nombre = null
    this.tiempo = null
  }
}
