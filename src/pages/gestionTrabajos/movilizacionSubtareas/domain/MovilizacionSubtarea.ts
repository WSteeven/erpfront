import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MovilizacionSubtarea extends EntidadAuditable {
  subtarea: number | null
  empleado: number | null
  grupo: number | null
  fecha_hora_salida: string | null
  fecha_hora_llegada: string | null
  tiempo_transcurrido: string | null
  estado: string | null
  motivo: string | null
  longitud: number | null
  latitud: number | null

  constructor() {
    super()
    this.subtarea = null
    this.empleado = null
    this.grupo = null
    this.fecha_hora_salida = null
    this.fecha_hora_llegada = null
    this.tiempo_transcurrido = null
    this.estado = null
    this.motivo = null
    this.longitud = null
    this.latitud = null
  }
}
