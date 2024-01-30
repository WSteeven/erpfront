export class ExamenSolicitado {
  examen_id: number | null
  laboratorio_id: number | null
  fecha_asistencia: string | null
  hora_asistencia: string | null

  constructor() {
    this.examen_id = null
    this.laboratorio_id = null
    this.fecha_asistencia = null
    this.hora_asistencia = null
  }
}
