import { endpoints } from "config/api";
import { Tanqueo } from "../domain/Tanqueo";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

export class TanqueoController extends TransaccionSimpleController<Tanqueo>{
    constructor(){
        super(endpoints.tanqueos)
    }
}