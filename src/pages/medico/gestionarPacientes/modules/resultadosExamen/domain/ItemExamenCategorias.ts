import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ConfiguracionExamenCampo } from './ConfiguracionExamenCampo'

export class ItemExamenCategorias extends EntidadAuditable {
  categoria: string | number | null
  categoria_id: number | null
  campos: ConfiguracionExamenCampo[]

  constructor() {
    super()
    this.categoria = null
    this.categoria_id = null
    this.campos = []
  }
}
