import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Empleado } from "../domain/Empleado";
import { endpoints } from "config/api";

export class ChoferController extends TransaccionSimpleController<Empleado>{
    constructor(){
        super(endpoints.empleados_choferes)
    }
}