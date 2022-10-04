import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Empleado } from "../domain/Empleado";
import { endpoints } from "config/api";

export class EmpleadoController extends TransaccionSimpleController<Empleado>{
    constructor(){
        super(endpoints.empleados)
    }
}