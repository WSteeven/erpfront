import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { ProgresivaModales } from '../domain/ProgresivaModales'

export class ComportamientoModalesProgresiva extends ComportamientoModales<ProgresivaModales> {
  constructor() {
    super(new ProgresivaModales())
  }
}
