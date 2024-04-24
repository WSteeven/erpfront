import { ConfiguracionExamenCategorias } from './ConfiguracionExamenCategorias'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ItemExamen extends EntidadAuditable {
  examen: string | null
  categorias: ConfiguracionExamenCategorias[]

  constructor() {
    super()
    this.examen = null
    this.categorias = []
  }
}
