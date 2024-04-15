import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AntecedenteTrabajoAnterior extends EntidadAuditable {
  empresa: string | null
  puesto_trabajo: string | null
  actividades_desempenaba: string | null
  tiempo_trabajo_meses: number | null
  r_fisico: boolean
  r_mecanico: boolean
  r_quimico: boolean
  r_biologico: boolean
  r_ergonomico: boolean
  r_psicosocial: boolean
  observacion: string | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.empresa = null
    this.puesto_trabajo = null
    this.actividades_desempenaba = null
    this.tiempo_trabajo_meses = null
    this.r_fisico = false
    this.r_mecanico = false
    this.r_quimico = false
    this.r_biologico = false
    this.r_ergonomico = false
    this.r_psicosocial = false
    this.observacion = null
    this.ficha_preocupacional = null
  }
}
