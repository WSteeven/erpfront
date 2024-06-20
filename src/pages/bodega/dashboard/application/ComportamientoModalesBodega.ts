import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { DashboardBodegaModales } from '../domain/DashboardBodegaModales';


export class ComportamientoModalesBodega extends ComportamientoModales<DashboardBodegaModales> {
    constructor() {
        super(new DashboardBodegaModales())
    }
}