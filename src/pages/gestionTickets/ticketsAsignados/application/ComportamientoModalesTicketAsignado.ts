import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TrabajoAsignadoModales } from 'gestionTrabajos/trabajoAsignado/domain/TrabajoAsignadoModales'

export class ComportamientoModalesTicketAsignado extends ComportamientoModales<TrabajoAsignadoModales> {
  constructor() {
    super(new TrabajoAsignadoModales())
  }
}
