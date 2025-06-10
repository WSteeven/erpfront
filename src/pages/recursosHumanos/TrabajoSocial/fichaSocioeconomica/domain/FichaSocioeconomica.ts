import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Conyuge } from 'trabajoSocial/fichaSocioeconomica/domain/Conyuge'
import { ExperienciaLaboral } from 'trabajoSocial/fichaSocioeconomica/domain/ExperienciaLaboral'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'
import { SituacionSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/SituacionSocioeconomica'
import { Salud } from 'trabajoSocial/salud/domain/Salud'

export class FichaSocioeconomica extends EntidadAuditable {
  empleado: string | null
  lugar_nacimiento: string | null
  canton: string | null
  contacto_emergencia: string | null
  contacto_emergencia_externo: string | null
  parentesco_contacto_emergencia: string | null
  parentesco_contacto_emergencia_externo: string | null
  telefono_contacto_emergencia: string | null
  telefono_contacto_emergencia_externo: string | null
  ciudad_contacto_emergencia_externo: string | null
  problemas_ambiente_social_familiar: any
  observaciones_ambiente_social_familiar: string | null
  conocimientos: any
  capacitaciones: any
  imagen_rutagrama: string | null
  vias_transito_regular_trabajo: string | null
  conclusiones: string | null
  tiene_conyuge: boolean
  tiene_hijos: boolean
  tiene_experiencia_previa: boolean
  conyuge: Conyuge | null
  hijos: any
  experiencia_previa: ExperienciaLaboral | null
  vivienda: Vivienda | null
  situacion_socioeconomica: SituacionSocioeconomica | null
  salud: Salud | null
  composicion_familiar: any
  tiene_capacitaciones: boolean

  constructor() {
    super()
    this.empleado = null
    this.lugar_nacimiento = null
    this.canton = null
    this.contacto_emergencia = null
    this.contacto_emergencia_externo = null
    this.parentesco_contacto_emergencia = null
    this.parentesco_contacto_emergencia_externo = null
    this.telefono_contacto_emergencia = null
    this.telefono_contacto_emergencia_externo = null
    this.ciudad_contacto_emergencia_externo = null
    this.tiene_conyuge = false
    this.tiene_hijos = false
    this.tiene_experiencia_previa = true
    this.conyuge = new Conyuge()
    this.experiencia_previa = new ExperienciaLaboral()
    this.hijos = []
    this.vivienda = new Vivienda()
    this.situacion_socioeconomica = new SituacionSocioeconomica()
    this.salud = new Salud()
    this.composicion_familiar = []
    this.problemas_ambiente_social_familiar = []
    this.observaciones_ambiente_social_familiar = null
    this.tiene_capacitaciones = null
    this.conocimientos = []
    this.capacitaciones = []
    this.conclusiones = null
    this.imagen_rutagrama = null
    this.vias_transito_regular_trabajo = null
  }
}
