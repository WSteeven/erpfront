import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Evento extends EntidadAuditable {
  titulo: string | null
  tipo_evento: string | null
  fecha_hora_inicio: string | null
  fecha_hora_fin: string | null
  descripcion: string | null
  anfitrion: string | null
  es_editable: boolean
  es_personalizado: boolean
  colorScheme: []

  constructor() {
    super()
    this.titulo = null
    this.tipo_evento = null
    this.fecha_hora_inicio = null
    this.fecha_hora_fin = null
    this.descripcion = null
    this.anfitrion = null
    this.es_editable =true
    this.es_personalizado = false
    this.colorScheme = []
  }
}
