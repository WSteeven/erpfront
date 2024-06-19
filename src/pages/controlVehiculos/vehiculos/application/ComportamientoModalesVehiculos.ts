import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { VehiculoModales } from '../domain/VehiculoModales';

export class ComportamientoModalesVehiculos extends ComportamientoModales<VehiculoModales> {
    constructor() {
        super(new VehiculoModales())
    }
}