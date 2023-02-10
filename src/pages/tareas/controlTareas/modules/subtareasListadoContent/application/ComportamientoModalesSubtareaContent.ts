import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { SubtareaListadoContentModales } from '../domain/SubtareaListadoContentModales'

export class ComportamientoModalesSubtareaContent extends ComportamientoModales<SubtareaListadoContentModales> {
  constructor() {
    super(new SubtareaListadoContentModales())
  }
}
