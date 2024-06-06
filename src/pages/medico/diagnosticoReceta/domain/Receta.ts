import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Receta extends EntidadAuditable {
  rp: string | null
  prescripcion: string | null
  cita_medica: number | null
  registro_empleado_examen: number | null

  constructor() {
    super()
    this.rp = null
    this.prescripcion = null
    this.cita_medica = null
    this.registro_empleado_examen = null
  }
}
