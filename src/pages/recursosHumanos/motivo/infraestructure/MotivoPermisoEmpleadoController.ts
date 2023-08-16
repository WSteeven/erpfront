import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { MotivoPermisoEmpleado } from "../domain/MotivoPermisoEmpleado";
import { endpoints } from "config/api";

export class MotivoPermisoEmpleadoController extends TransaccionSimpleController<MotivoPermisoEmpleado>{
  constructor(){
    super(endpoints.motivo_permiso_empleado)
  }
}

