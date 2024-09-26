import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';

export class ValoresFondosEmpleadoController extends TransaccionSimpleController<any> {
    constructor() {
        super(endpoints.reporte_valores_fondos_empleados)
    }
}