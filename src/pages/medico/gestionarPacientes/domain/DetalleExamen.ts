import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DetalleExamen { //extends EntidadAuditable {
  tipo_examen: string | number | null
  categoria_examen: string | number | null
  examen: string | number | null
  estado: number | null
  seleccionado: boolean

  constructor() {
    // super()
    this.tipo_examen = null
    this.categoria_examen = null
    this.examen = null
    this.estado = null
    this.seleccionado = false
  }
}
