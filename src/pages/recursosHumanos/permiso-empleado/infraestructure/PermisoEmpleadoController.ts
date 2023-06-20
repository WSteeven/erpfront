import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { PermisoEmpleado } from "../domain/PermisoEmpleado";
import { endpoints } from "config/api";

export class PermisoEmpleadoController extends TransaccionSimpleController<PermisoEmpleado>{
  constructor(){
    super(endpoints.permiso_empleado)
  }
}

