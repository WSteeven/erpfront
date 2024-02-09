import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Diagnostico } from './Diagnostico'

export class Consulta extends EntidadAuditable {
  empleado: number | null
  diagnosticos: Diagnostico[]
  cita: number | null
  receta: string | null

  constructor() {
    super()
    this.empleado = null
    this.diagnosticos = []
    this.cita = null
    this.receta = null
  }
}
