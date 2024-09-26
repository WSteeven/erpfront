import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AntecedenteTrabajoAnterior extends EntidadAuditable {
  empresa: string | null
  puesto_trabajo: string | null
  actividades: string | null
  tiempo_trabajo: number | null
  // r_fisico: boolean
  // r_mecanico: boolean
  // r_quimico: boolean
  // r_biologico: boolean
  // r_ergonomico: boolean
  // r_psicosocial: boolean
  observaciones: string | null
  tipos_riesgos_ids?: number[]
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.empresa = null
    this.puesto_trabajo = null
    this.actividades = null
    this.tiempo_trabajo = null
    // this.r_fisico = false
    // this.r_mecanico = false
    // this.r_quimico = false
    // this.r_biologico = false
    // this.r_ergonomico = false
    // this.r_psicosocial = false
    this.observaciones = null
    this.tipos_riesgos_ids = []
    this.ficha_preocupacional = null
  }
}
