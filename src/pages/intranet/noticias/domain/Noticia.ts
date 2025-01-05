import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Noticia extends EntidadAuditable {
  id: number | null
  titulo: string | null
  descripcion: string | null
  fecha_creacion: string | null
  fecha_vencimiento: string | null
  autor: string | null
  categoria: string | null
  etiquetas: []
  imagen_noticia: string | null
  departamentos_destinatarios: []
  para_todos: boolean

  constructor() {
    super()
    this.id = null
    this.titulo = null
    this.descripcion = ''
    this.fecha_creacion = null
    this.fecha_vencimiento = null
    this.autor = null
    this.categoria = null
    this.etiquetas = []
    this.imagen_noticia = null
    this.departamentos_destinatarios = []
    this.para_todos = true
  }
}
