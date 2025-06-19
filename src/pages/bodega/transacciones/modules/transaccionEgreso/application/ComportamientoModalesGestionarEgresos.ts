import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { TransaccionEgresoModales } from '../domain/TransaccionEgresoModales';

export class ComportamientoModalesTransaccionEgreso extends ComportamientoModales<TransaccionEgresoModales> {
    constructor() {
        super(new TransaccionEgresoModales())

    }
}
