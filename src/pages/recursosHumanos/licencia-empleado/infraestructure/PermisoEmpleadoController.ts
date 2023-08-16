import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { LicenciaEmpleado } from '../domain/LicenciaEmpleado';
import { endpoints } from 'config/api';

export class PermisoEmpleadoController extends TransaccionSimpleController<LicenciaEmpleado>{
  constructor(){
    super(endpoints.licencia_empleado)
  }
}

