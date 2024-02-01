export class ExamenSolicitado {
  examen: number | null
  laboratorio_clinico: number | null
  fecha_asistencia: string | null
  hora_asistencia: string | null

  constructor() {
    this.examen = null
    this.laboratorio_clinico = null
    this.fecha_asistencia = null
    this.hora_asistencia = null
  }
}
