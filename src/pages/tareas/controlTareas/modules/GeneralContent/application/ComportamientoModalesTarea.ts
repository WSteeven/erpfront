import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TareaModales } from '../domain/TareaModales'

export class ComportamientoModalesTarea extends ComportamientoModales<TareaModales> {
    constructor() {
        super(new TareaModales())
    }
}
