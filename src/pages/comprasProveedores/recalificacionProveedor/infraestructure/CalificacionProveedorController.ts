import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { CalificacionProveedor } from '../domain/CalificacionProveedor';

export class CalificacionProveedorController extends TransaccionSimpleController<CalificacionProveedor> {
    constructor() {
        super(endpoints.calificacion_proveedor)
    }
}