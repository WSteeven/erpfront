import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { GeneradorCashModales } from '../domain/GeneradorCashModales'

export class ComportamientoModalesGeneradorCash extends ComportamientoModales<GeneradorCashModales> {
    constructor() {
        super(new GeneradorCashModales())
    }
}
