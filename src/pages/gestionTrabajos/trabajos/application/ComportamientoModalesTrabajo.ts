import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TrabajoModales } from '../domain/TrabajoModales'

export class ComportamientoModalesTrabajo extends ComportamientoModales<TrabajoModales> {
  constructor() {
    super(new TrabajoModales())
  }
}
