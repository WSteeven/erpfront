import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Evento extends EntidadAuditable {
  titulo: string | null
  tipo_evento: string | null
  fecha_hora_inicio: Date | null
  fecha_hora_fin: Date | null
  descripcion: string | null
  constructor() {
    super()
    this.titulo = null
    this.tipo_evento = null
    this.fecha_hora_inicio = null
    this.fecha_hora_fin = null
    this.descripcion = null
  }
}
