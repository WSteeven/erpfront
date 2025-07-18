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
  especificacion_terreno: string | null
  tiene_bienes: boolean
  especificacion_bienes: string | null
  tiene_ingresos_adicionales: boolean
  especificacion_ingresos_adicionales: string | null
  ingresos_adicionales: number | null

  apoya_familiar_externo: boolean
  valor_apoyo_familiar_externo: string | null
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
    this.especificacion_terreno = null
    this.tiene_bienes = null
    this.especificacion_bienes = null
    this.tiene_ingresos_adicionales = false
    this.especificacion_ingresos_adicionales = null
    this.ingresos_adicionales = null

    this.apoya_familiar_externo = false
    this.valor_apoyo_familiar_externo =null
    this.familiar_externo_apoyado = null
  }
}
