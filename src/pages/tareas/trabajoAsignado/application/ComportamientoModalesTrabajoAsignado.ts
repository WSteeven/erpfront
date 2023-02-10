import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TrabajoAsignadoModales } from 'pages/tareas/trabajoAsignado/domain/TrabajoAsignadoModales'

export class ComportamientoModalesTrabajoAsignado extends ComportamientoModales<TrabajoAsignadoModales> {
    constructor() {
        super(new TrabajoAsignadoModales())
    }
}
