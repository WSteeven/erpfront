import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {HorarioEmpleado} from 'controlPersonal/horariosEmpleados/application/HorarioEmpleado';
import {endpoints} from 'config/api';

export class HorarioEmpleadoController extends TransaccionSimpleController<HorarioEmpleado>{
    constructor() {
        super(endpoints.horariosEmpleado);
    }
}