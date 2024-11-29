import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Formulario extends EntidadAuditable {
  nombre: string | null
  formulario: []
  respuestas: string | null
  es_recurrente: boolean
  periodo_recurrencia: number | null
  fecha_inicio: string | null
  tipo: string | null //interna,externa
  activa: boolean

  constructor() {
    super()
    this.nombre = null
    this.formulario = []
    this.respuestas = null
    this.es_recurrente = false
    this.periodo_recurrencia = null
    this.fecha_inicio = null
    this.tipo = null
    this.activa = null
  }
}
