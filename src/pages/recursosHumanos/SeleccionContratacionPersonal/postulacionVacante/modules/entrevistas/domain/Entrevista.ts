import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Entrevista extends EntidadAuditable {
  postulacion_id: number | null
  fecha_hora: string | null
  duracion: number | null
  reagendada: boolean
  observacion: string | null
  nueva_fecha_hora: string | null
  asistio: boolean
  presencial: boolean
  link: string| null
  canton: number| null
  direccion: string| null

  constructor() {
    super()
    this.id = null
    this.postulacion_id = null
    this.fecha_hora = null
    this.duracion = null
    this.reagendada = false
    this.observacion = null
    this.nueva_fecha_hora = null
    this.asistio = false
    this.presencial = true
    this.link = null
    this.canton = null
    this.direccion = null
  }
}
