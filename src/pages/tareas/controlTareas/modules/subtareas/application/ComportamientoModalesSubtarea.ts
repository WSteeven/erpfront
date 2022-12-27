import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { SubtareaModales } from '../domain/SubtareaModales'

export class ComportamientoModalesSubtarea extends ComportamientoModales<SubtareaModales> {
  constructor() {
    super(new SubtareaModales())
  }
}
