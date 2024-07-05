import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DescripcionAntecedenteTrabajo extends EntidadAuditable {
  calificado_iss: number
  instituto_seguridad_social: string | null
  fecha: string | null
  observacion: string | null
  tipo_descripcion_antecedente_trabajo: number | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.calificado_iss = 1
    this.instituto_seguridad_social = null
    this.fecha = null
    this.observacion = null
    this.tipo_descripcion_antecedente_trabajo = null
    this.ficha_preocupacional = null
  }
}
