import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EsquemaVacuna extends EntidadAuditable {
  dosis_aplicadas: number | null
  observacion: string | null
  tipo_vacuna: number | null
  tipo_vacuna_id: number | null
  paciente: number | null

  constructor() {
    super()
    this.dosis_aplicadas = null
    this.observacion = null
    this.tipo_vacuna = null
    this.tipo_vacuna_id = null
    this.paciente = null
  }
}
