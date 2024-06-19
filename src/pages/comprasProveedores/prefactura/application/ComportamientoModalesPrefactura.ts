import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { PrefacturaModales } from '../domain/PrefacturaModales';

export class ComportamientoModalesPrefactura extends ComportamientoModales<PrefacturaModales> {
    constructor() {
        super(new PrefacturaModales())
    }
}