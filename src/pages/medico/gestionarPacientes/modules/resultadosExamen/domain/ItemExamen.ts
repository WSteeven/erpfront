import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ItemExamenCategorias } from './ItemExamenCategorias'

export class ItemExamen extends EntidadAuditable {
  examen: string | null
  examen_solicitado: number | null
  categorias: ItemExamenCategorias[]

  constructor() {
    super()
    this.examen = null
    this.examen_solicitado = null
    this.categorias = []
  }
}
