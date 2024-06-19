import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { OrdenReparacion } from '../domain/OrdenReparacion';
import { endpoints } from 'config/api';

export class OrdenReparacionController extends TransaccionSimpleController<OrdenReparacion> {
    constructor() {
        super(endpoints.ordenes_reparaciones)
    }
}