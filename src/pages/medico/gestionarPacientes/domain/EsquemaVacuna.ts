import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EsquemaVacuna extends EntidadAuditable {
  dosis_aplicadas: number | null
  observacion: string | null
  url_certificado: string | null
  tipo_vacuna: number | null

  constructor() {
    super()
    this.dosis_aplicadas = null
    this.observacion = null
    this.url_certificado = null
    this.tipo_vacuna = null
  }
}
