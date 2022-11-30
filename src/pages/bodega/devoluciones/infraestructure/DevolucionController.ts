import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Devolucion } from "../domain/Devolucion";
import { endpoints } from "config/api";

export class DevolucionController extends TransaccionSimpleController<Devolucion>{
    constructor(){
        super(endpoints.devoluciones)
    }
}