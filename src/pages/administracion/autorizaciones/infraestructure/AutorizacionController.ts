import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Autorizacion } from "../domain/Autorizacion";
import { endpoints } from "config/api";

export class AutorizacionController extends TransaccionSimpleController<Autorizacion>{
    constructor(){
        super(endpoints.autorizaciones)
    }
}