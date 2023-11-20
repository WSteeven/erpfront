import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { PlanMantenimiento } from "../domain/PlanMantenimiento";
import { endpoints } from "config/api";

export class PlanMantenimientoController extends TransaccionSimpleController<PlanMantenimiento>{
    constructor(){
        super(endpoints.planes_mantenimientos)
    }
}