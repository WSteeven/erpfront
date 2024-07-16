import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { EstadoPermisoEmpleado } from '../domain/EstadoPermisoEmpleado';
import { endpoints } from 'config/api';

export class EstadoPermisoEmpleadoController extends TransaccionSimpleController<EstadoPermisoEmpleado> {
  constructor() {
    super(endpoints.estado_permiso_empleado)
  }
}

