import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DescripcionAntecedenteTrabajo extends EntidadAuditable {
  calificado_iess: boolean
  descripcion: string | null
  fecha: string | null
  observacion: string | null
  tipo_descripcion_antecedente_trabajo: number | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.calificado_iess = true
    this.descripcion = null
    this.fecha = null
    this.observacion = null
    this.tipo_descripcion_antecedente_trabajo = null
    this.ficha_preocupacional = null
  }
}
