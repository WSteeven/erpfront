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
    this.presion_arterial = 0
    this.temperatura = 0
    this.frecuencia_cardiaca = 0
    this.saturacion_oxigeno = 0
    this.frecuencia_respiratoria = 0
    this.peso = 0
    this.talla = 0
    this.indice_masa_corporal = 0
    this.perimetro_abdominal = 0
    this.ficha_preocupacional = 0
  }
}
