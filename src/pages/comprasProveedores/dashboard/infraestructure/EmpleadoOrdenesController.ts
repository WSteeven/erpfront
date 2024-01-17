import { endpoints } from "config/api";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

export class EmpleadoOrdenesController extends TransaccionSimpleController<Empleado>{
    constructor(){
        super(endpoints.empleados_ordenes)
    }
}