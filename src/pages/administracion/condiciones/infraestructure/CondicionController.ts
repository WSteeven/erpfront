import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Condicion } from "../domain/Condicion";
import { endpoints } from "config/api";

export class CondicionController extends TransaccionSimpleController<Condicion>{
    constructor(){
        super(endpoints.condiciones)
    }
}