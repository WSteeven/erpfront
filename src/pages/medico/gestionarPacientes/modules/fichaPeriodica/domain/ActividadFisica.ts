import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ActividadFisica extends EntidadAuditable {
  nombre_actividad: string | null
  tiempo: number | null

  constructor() {
    super()
    this.nombre_actividad = null
    this.tiempo = null
  }
}
