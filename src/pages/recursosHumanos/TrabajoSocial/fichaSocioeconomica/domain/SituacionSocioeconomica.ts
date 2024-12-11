import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SituacionSocioeconomica extends EntidadAuditable {
  cantidad_personas_aportan: number | null
  cantidad_personas_dependientes: number | null
  recibe_apoyo_economico_otro_familiar: boolean
  familiar_apoya_economicamente: string | null
  recibe_apoyo_economico_gobierno: boolean
  institucion_apoya_economicamente: string | null
  tiene_prestamos: boolean
  cantidad_prestamos: number | null
  entidad_bancaria: string | null
  tiene_tarjeta_credito: boolean
  cantidad_tarjetas_credito: number | null
  vehiculo: string | null
  tiene_terreno: boolean
  tiene_bienes: boolean
  tiene_ingresos_adicionales: boolean
  ingresos_adicionales: number|null
  sbf_luz: string | null
  sbf_agua: string | null
  sbf_telefono: string | null
  sbf_internet: string | null
  sbf_cable: string | null
  sbf_servicios_sanitarios: string | null
  apoya_familiar_externo: boolean
  familiar_externo_apoyado: string | null

  constructor() {
    super()
    this.cantidad_personas_aportan = null
    this.cantidad_personas_dependientes = null
    this.recibe_apoyo_economico_otro_familiar = null
    this.familiar_apoya_economicamente = null
    this.recibe_apoyo_economico_gobierno = null
    this.institucion_apoya_economicamente = null
    this.tiene_prestamos = null
    this.cantidad_prestamos = null
    this.entidad_bancaria = null
    this.tiene_tarjeta_credito = null
    this.cantidad_tarjetas_credito = null
    this.vehiculo = null
    this.tiene_terreno = null
    this.tiene_bienes = null
    this.tiene_ingresos_adicionales = false
    this.ingresos_adicionales = null
    this.sbf_luz = null
    this.sbf_agua = null
    this.sbf_telefono = null
    this.sbf_internet = null
    this.sbf_cable = null
    this.sbf_servicios_sanitarios = null
    this.apoya_familiar_externo = false
    this.familiar_externo_apoyado = null

  }
}
