import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Piso } from "../domain/Piso";
import { endpoints } from "config/api";

export class PisoController extends TransaccionSimpleController<Piso>{
    constructor(){
        super(endpoints.pisos)
    }
}