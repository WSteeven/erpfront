import { endpoints } from "config/api";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Empleado } from "../domain/Empleado";

export class EmpleadoRoleController extends TransaccionSimpleController<Empleado>{
  constructor() {
    super(endpoints.empleados_roles)
  }
}
