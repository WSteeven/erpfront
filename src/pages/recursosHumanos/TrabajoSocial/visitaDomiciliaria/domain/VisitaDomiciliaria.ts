import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Salud } from 'trabajoSocial/salud/domain/Salud'
import { EconomiaFamiliar } from 'trabajoSocial/economia_familiar/domain/EconomiaFamiliar'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'

export class VisitaDomiciliaria extends EntidadAuditable {
  empleado: string | null
  lugar_nacimiento: string | null
  canton: string | null
  contacto_emergencia: string | null
  parentesco_contacto_emergencia: string | null
  telefono_contacto_emergencia: string | null
  composicion_familiar: any
  imagen_genograma: string | null
  imagen_visita_domiciliaria: string | null
  salud: Salud | null
  economia_familiar: EconomiaFamiliar | null
  vivienda: Vivienda | null
  diagnostico_social: string | null
  observaciones: string | null

  constructor() {
    super()
    this.empleado = null
    this.composicion_familiar = []
    this.imagen_genograma = null
    this.imagen_visita_domiciliaria = null
    this.salud = new Salud()
    this.economia_familiar = new EconomiaFamiliar()
    this.vivienda = new Vivienda()
    this.diagnostico_social = null
    this.observaciones = null
  }
}
