import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { SeguimientoIncidenteModales } from '../domain/SeguimientoIncidenteModales'

export class ComportamientoModalesSeguimientoIncidente extends ComportamientoModales<SeguimientoIncidenteModales> {
    constructor() {
        super(new SeguimientoIncidenteModales())
    }
}
