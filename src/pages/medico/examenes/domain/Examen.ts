import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Examen extends EntidadAuditable {
  nombre: string | number | null
  examen: string | number | null
  categoria: string | number | null
  tipo_examen: string | number | null
  detalle_resultado_examen: number | null

  constructor() {
    super()
    this.categoria = null
    this.nombre = null
    this.examen = null
    this.tipo_examen = null
    this.detalle_resultado_examen = null
  }
}
