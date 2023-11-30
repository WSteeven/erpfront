import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Proyecto extends EntidadAuditable {
  codigo_proyecto: number | null
  coordinador: number | null
  fiscalizador: number | null
  canton: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  cliente: number | null
  cliente_id: number | null
  costo: number | null
  nombre: string | null
  fecha_solicitud: string | null
  demora: string | null
  finalizado: boolean

  etapas: any[]

  constructor() {
    super()
    this.codigo_proyecto = null
    this.coordinador = null
    this.fiscalizador = null
    this.canton = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.cliente = null
    this.cliente_id = null
    this.costo = null
    this.nombre = null
    this.fecha_solicitud = null
    this.demora = null
    this.finalizado = false

    this.etapas = []
  }
}
