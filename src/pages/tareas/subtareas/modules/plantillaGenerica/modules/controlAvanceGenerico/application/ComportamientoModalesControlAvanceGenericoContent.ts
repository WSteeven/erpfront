import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { ControlAvanceModales } from '../domain/ControlAvanceModales'

export class ComportamientoModalesControlAvanceGenericoContent extends ComportamientoModales<ControlAvanceModales> {
    constructor() {
        super(new ControlAvanceModales())
    }
}
