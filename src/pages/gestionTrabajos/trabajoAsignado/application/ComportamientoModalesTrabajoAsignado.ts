import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TrabajoAsignadoModales } from 'gestionTrabajos/trabajoAsignado/domain/TrabajoAsignadoModales'

export class ComportamientoModalesTrabajoAsignado extends ComportamientoModales<TrabajoAsignadoModales> {
  constructor() {
    super(new TrabajoAsignadoModales())
  }
}
