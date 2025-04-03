import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import NovedadVenta from '../domain/NovedadVenta';

export class SeguimientoVentaController extends TransaccionSimpleController<NovedadVenta>{
    constructor(){
        super(endpoints.novedades_ventas)
    }
}