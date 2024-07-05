import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Noticia extends EntidadAuditable {
  id: number | null
  titulo: string | null
  descripcion: string | null
  fecha_creacion: string | null
  autor: string | null
  categoria: string | null
  etiquetas: string[] | null
  url_imagen: string | null

  constructor() {
    super()
    this.id = null
    this.titulo = null
    this.descripcion = null
    this.fecha_creacion = null
    this.autor = null
    this.categoria = null
    this.etiquetas = null
    this.url_imagen = null
  }
}
