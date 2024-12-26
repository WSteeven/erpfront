import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SeguimientoAccidente extends EntidadAuditable {
  condiciones_climatologicas: string | null
  condiciones_laborales: string | null
  autorizaciones_permisos_texto: string | null
  autorizaciones_permisos_foto: string | null
  se_notifica_riesgos_trabajo: boolean
  actividades_desarrolladas: string | null
  descripcion_amplia_accidente: string
  antes_accidente: string
  instantes_previos: string
  durante_accidente: string
  despues_accidente: string
  hipotesis_causa_accidente: string
  causas_inmediatas: string
  causas_basicas: string
  medidas_preventivas: string
  seguimiento_sso: string | null
  seguimiento_trabajo_social: string | null
  seguimiento_rrhh: string | null
  tarea: number | null
  subtarea: number | null
  accidente: number | null
  // --
  metodologia_utilizada: string | null
  consultas_medicas: any[]
  fecha_hora_accidente: string | null

  constructor() {
    super()
    this.condiciones_climatologicas = null
    this.condiciones_laborales = null
    this.autorizaciones_permisos_texto = null
    this.autorizaciones_permisos_foto = null
    this.se_notifica_riesgos_trabajo = false
    this.actividades_desarrolladas = null
    this.descripcion_amplia_accidente = ''
    this.antes_accidente = ''
    this.instantes_previos = ''
    this.durante_accidente = ''
    this.despues_accidente = ''
    this.hipotesis_causa_accidente = ''
    this.causas_inmediatas = ''
    this.causas_basicas = ''
    this.medidas_preventivas = ''
    this.seguimiento_sso = null
    this.seguimiento_trabajo_social = null
    this.seguimiento_rrhh = null
    this.tarea = null
    this.subtarea = null
    this.accidente = null
    this.metodologia_utilizada = null
    this.consultas_medicas = []
    this.fecha_hora_accidente = null
  }
}