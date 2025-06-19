import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { DashboardControlPersonalModales } from '../domain/DashboardControlPersonalModales';

export class ComportamientoModalesControlPersonal extends ComportamientoModales<DashboardControlPersonalModales> {
    constructor() {
        super(new DashboardControlPersonalModales());
    }
}
