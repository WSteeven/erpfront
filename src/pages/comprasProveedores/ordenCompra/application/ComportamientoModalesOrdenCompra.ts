import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { OrdenCompraModales } from '../domain/OrdenCompraModales';

export class ComportamientoModalesOrdenCompra extends ComportamientoModales<OrdenCompraModales> {
    constructor() {
        super(new OrdenCompraModales())
    }
}