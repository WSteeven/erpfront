import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { OrdenCompra } from '../domain/OrdenCompra';
import { endpoints } from 'config/api';

export class OrdenCompraController extends TransaccionSimpleController<OrdenCompra> {
    constructor() {
        super(endpoints.ordenes_compras)
    }
}