import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Servicio } from "../domain/Servicio";
import { endpoints } from "config/api";

export class ServicioController extends TransaccionSimpleController<Servicio>{
    constructor(){
        super(endpoints.servicios)
    }
}