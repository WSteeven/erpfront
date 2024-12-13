import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Conyuge } from 'trabajoSocial/fichaSocioeconomica/domain/Conyuge'
import { ExperienciaLaboral } from 'trabajoSocial/fichaSocioeconomica/domain/ExperienciaLaboral'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'
import {
  SituacionSocioeconomica
} from 'trabajoSocial/fichaSocioeconomica/domain/SituacionSocioeconomica'
import { Salud } from 'trabajoSocial/salud/domain/Salud'
import { AmbienteSocial } from 'trabajoSocial/fichaSocioeconomica/domain/AmbienteSocial'
import { ServicioBasico } from 'trabajoSocial/servicios_basicos/domain/ServicioBasico'

export class FichaSocioeconomica extends EntidadAuditable {
  empleado: string | null
  lugar_nacimiento: string | null
  coordenadas: string | null
  imagen_rutagrama: string | null
  vias_transito_regular_trabajo: string | null
  telefono_domicilio: string | null
  ciudad_trabajo: string | null
  contacto_emergencia: string | null
  parentesco_contacto_emergencia: string | null
  telefono_contacto_emergencia: string | null
  tiene_conyuge: boolean
  tiene_hijos: boolean
  tiene_experiencia_previa: boolean

  conyuge: Conyuge | null
  hijos: any
  experiencia_previa: ExperienciaLaboral|null
  vivienda: Vivienda|null
  situacion_socioeconomica: SituacionSocioeconomica|null
  servicios_basicos: ServicioBasico|null
  salud: Salud | null
  ambiente_social_familiar: AmbienteSocial|null
  composicion_familiar:any
  tiene_capacitaciones:boolean
  conocimientos:any
  capacitaciones:any
  conclusiones: string | null

  constructor() {
    super()
    this.empleado = null
    this.lugar_nacimiento = null
    this.coordenadas = null
    this.telefono_domicilio = null
    this.ciudad_trabajo = null
    this.contacto_emergencia = null
    this.parentesco_contacto_emergencia = null
    this.telefono_contacto_emergencia = null
    this.tiene_conyuge = false
    this.tiene_hijos = false
    this.tiene_experiencia_previa = true
    this.conyuge = new Conyuge()
    this.experiencia_previa = new ExperienciaLaboral()
    this.hijos = []
    this.vivienda = new Vivienda()
    this.situacion_socioeconomica = new SituacionSocioeconomica()
    this.servicios_basicos = new ServicioBasico()
    this.salud = new Salud()
    this.composicion_familiar = []
    this.ambiente_social_familiar = new AmbienteSocial()
    this.tiene_capacitaciones = null
    this.conocimientos = []
    this.capacitaciones = []
    this.conclusiones = null
    this.imagen_rutagrama= null
    this.vias_transito_regular_trabajo= null
  }
}
