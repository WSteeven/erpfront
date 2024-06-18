import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { SeleccionEmpleadoModales } from '../domain/SeleccionEmpleadoModales';

export class ComportamientoModalesSeleccionEmpleado extends ComportamientoModales<SeleccionEmpleadoModales> {
    constructor() {
        super(new SeleccionEmpleadoModales())
    }
}
