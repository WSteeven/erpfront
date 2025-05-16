import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { PagoProveedor } from '../domain/PagoProveedor';
import { endpoints } from 'config/api';

export class PagoProveedorController extends TransaccionSimpleController<PagoProveedor> {
    constructor() {
        super(endpoints.pagos_proveedores)
    }
}