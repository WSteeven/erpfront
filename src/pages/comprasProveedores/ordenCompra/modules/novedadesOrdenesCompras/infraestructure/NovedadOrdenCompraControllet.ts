import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import NovedadOrdenCompra from '../domain/SeguimientoOrdenCompra';
import { endpoints } from 'config/api';

export class NovedadOrdenCompraController extends TransaccionSimpleController<NovedadOrdenCompra> {
    constructor() {
        super(endpoints.novedades_ordenes_compras)
    }
}