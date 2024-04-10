import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoDiscapacidadPorcentaje extends EntidadAuditable {
  tipo_discapacidad: number | null
  porcentaje : number | null
  constructor() {
    super()
    this.tipo_discapacidad = null
    this.porcentaje = null
  }
}
