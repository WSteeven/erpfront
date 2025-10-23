import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  tipo_actividad: string | null
  asignada: boolean
  grupo: string | null
  estado_tarea: string | null
  orden_trabajo: string | null
  nombre_cliente: string | null
  direccion: string | null
  referencia: string | null
  latitud: number | null
  longitud: number | null
  coordenadas: []
  observacion: string | null
  comentario_anulacion: string | null
  celulares: string[]

  constructor() {
    super()
    this.tipo_actividad = null
    this.asignada = true
    this.comentario_anulacion = null
    this.celulares = []
    this.coordenadas = []

  }
}
