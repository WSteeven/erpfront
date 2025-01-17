import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Atrasos extends EntidadAuditable {
  empleado: number | null
  fecha_atraso: string | null // Fecha de atraso.
  minutos_atraso: number | null // Minutos de atraso.
  tiempo_atraso: string | null // Segundos de atraso.
  segundos_atraso: number | null // Segundos de atraso.
  justificacion: string | null // Texto de la justificación.
  justificador: string | null
  marcacion: string | null
  ocurrencia: string | null
  justificado: boolean
  imagen_evidencia: string | null
  revisado: boolean

  constructor() {
    super()
    this.empleado = null
    this.fecha_atraso = null
    this.minutos_atraso = null
    this.tiempo_atraso = null
    this.segundos_atraso = null
    this.justificacion = ''
    this.justificador = null
    this.marcacion = null
    this.ocurrencia = null
    this.justificado = false
    this.imagen_evidencia = null
    this.revisado = false
  }
}
