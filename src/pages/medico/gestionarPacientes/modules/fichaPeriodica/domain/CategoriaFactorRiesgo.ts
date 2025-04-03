import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CategoriaFactorRiesgo extends EntidadAuditable {
  nombre: string | null
  tipo_factor_riesgo: number | null

  constructor() {
    super()
    this.nombre = null
    this.tipo_factor_riesgo = null
  }
}
