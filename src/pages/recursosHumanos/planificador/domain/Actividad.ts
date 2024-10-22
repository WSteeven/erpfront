import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Actividad extends EntidadAuditable {
  id: number | null
  nombre: string | null
  subactividades: [] | null

  constructor() {
    super()
    this.nombre = null
    this.subactividades = []
  }
}
