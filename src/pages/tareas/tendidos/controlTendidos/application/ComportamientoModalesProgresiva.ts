import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TendidoModales } from '../domain/TendidoModales'

export class ComportamientoModalesProgresiva extends ComportamientoModales<TendidoModales> {
  constructor() {
    super(new TendidoModales())
  }
}
