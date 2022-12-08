import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Traspaso } from "../domain/Traspaso";
import { endpoints } from "config/api";

export class TraspasoController extends TransaccionSimpleController<Traspaso>{
    constructor(){
        super(endpoints.traspasos)
    }
}