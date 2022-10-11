import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { SubtareaContentModales } from '../domain/SubtareaContentModales'

export class ComportamientoModalesSubtareaContent extends ComportamientoModales<SubtareaContentModales> {
  constructor() {
    super(new SubtareaContentModales())
  }
}
