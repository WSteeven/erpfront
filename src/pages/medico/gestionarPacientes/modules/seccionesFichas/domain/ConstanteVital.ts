import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ConstanteVital extends EntidadAuditable {
  presion_arterial: number | null
  temperatura: number | null
  frecuencia_cardiaca: number | null
  saturacion_oxigeno: number | null
  frecuencia_respiratoria: number | null
  peso: number | null
  talla: number | null
  indice_masa_corporal: number | null
  perimetro_abdominal: number | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.presion_arterial = null
    this.temperatura = null
    this.frecuencia_cardiaca = null
    this.saturacion_oxigeno = null
    this.frecuencia_respiratoria = null
    this.peso = null
    this.talla = null
    this.indice_masa_corporal = null
    this.perimetro_abdominal = null
    this.ficha_preocupacional = null
  }
}
