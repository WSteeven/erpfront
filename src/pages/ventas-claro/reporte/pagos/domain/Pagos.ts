import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Pagos extends EntidadAuditable {
  fecha_inicio: Date | null
  fecha_fin: Date | null
  constructor() {
    super()
    this.fecha_inicio = null
    this.fecha_fin = null
  }
}
