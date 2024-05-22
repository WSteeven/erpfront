import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DetalleExamen { //extends EntidadAuditable {
  tipo_examen: string | number | null
  categoria: string | number | null
  examen: string | number | null
  estado_examen: number | null
  seleccionado: boolean

  constructor() {
    // super()
    this.tipo_examen = null
    this.categoria = null
    this.examen = null
    this.estado_examen = null
    this.seleccionado = false
  }
}
