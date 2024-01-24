import { endpoints } from "config/api";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

export class EmpleadoFondoRotativoController extends TransaccionSimpleController<any>{
    constructor(){
        super(endpoints.empleados_fondos_rotativos)
    }
}