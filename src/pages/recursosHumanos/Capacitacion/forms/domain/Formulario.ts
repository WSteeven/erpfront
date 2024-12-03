import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Formulario extends EntidadAuditable {
  empleado: string | null
  empleado_id: number | null
  nombre: string | null
  formulario: []
  respuestas: string | null
  es_recurrente: boolean
  periodo_recurrencia: number | null
  fecha_inicio: string | null
  tipo: string | null
  activo: boolean

  constructor() {
    super()
    this.empleado = null
    this.empleado_id= null
    this.nombre = null
    this.formulario = []
    this.respuestas = null
    this.es_recurrente = false
    this.periodo_recurrencia = null
    this.fecha_inicio = null
    this.tipo = null
    this.activo = true
  }
}
