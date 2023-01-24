import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Proyecto extends EntidadAuditable {
  codigo_proyecto: number | null
  coordinador: number | null
  canton: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  cliente: number | null
  costo: number | null
  nombre: string | null
  fecha_solicitud: string | null
  demora: string | null

  constructor() {
    super()
    this.codigo_proyecto = null
    this.coordinador = null
    this.canton = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.cliente = null
    this.costo = null
    this.nombre = null
    this.fecha_solicitud = null
    this.demora = null
  }
}
