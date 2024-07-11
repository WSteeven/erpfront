import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Vacante } from "../domain/Vacante";
import { endpoints } from "config/api";

export class VacanteController extends TransaccionSimpleController<Vacante>{
    constructor(){
        super(endpoints.vacantes)
    }
}