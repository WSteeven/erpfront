import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoVacuna extends EntidadAuditable {
  nombre: string | null
  dosis_totales: number | null

  constructor() {
    super()
    this.nombre = null
    this.dosis_totales = null
  }
}
