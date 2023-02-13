import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { PerchaModales } from '../domain/PerchaModales'

export class ComportamientoModalesPercha extends ComportamientoModales<PerchaModales>{
    constructor() {
        super(new PerchaModales())
    }
}