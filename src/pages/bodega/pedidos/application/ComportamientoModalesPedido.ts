import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { PedidoModales } from '../domain/PedidoModales';

export class ComportamientoModalesPedido extends ComportamientoModales<PedidoModales> {
    constructor() {
        super(new PedidoModales())
    }
}