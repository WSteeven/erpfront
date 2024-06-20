import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { PreordenCompra } from '../domain/PreordenCompra';

export class PreordenCompraController extends TransaccionSimpleController<PreordenCompra> {
    constructor() {
        super(endpoints.preordenes_compras)
    }
}