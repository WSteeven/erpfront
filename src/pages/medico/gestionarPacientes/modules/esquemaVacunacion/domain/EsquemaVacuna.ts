import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EsquemaVacuna extends EntidadAuditable {
  dosis_aplicadas: number | null
  observacion: string | null
  tipo_vacuna: number | null
  tipo_vacuna_id: number | null
  paciente: number | null
  dosis_totales: number | null
  fecha: string | null
  lote: string | null
  responsable_vacunacion: string | null
  establecimiento_salud: string | null
  fecha_caducidad: string | null
  es_dosis_unica: boolean
  archivos: string | null

  constructor() {
    super()
    this.dosis_aplicadas = 1
    this.observacion = null
    this.tipo_vacuna = null
    this.tipo_vacuna_id = null
    this.paciente = null
    this.dosis_totales = null
    this.fecha = null
    this.lote = null
    this.responsable_vacunacion = null
    this.establecimiento_salud = null
    this.fecha_caducidad = null
    this.es_dosis_unica = false
    this.archivos = null
  }
}
