import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Hilo } from "../domain/Hilo"; 
import { endpoints } from "config/api";

export class HiloController extends TransaccionSimpleController<Hilo>{
    constructor(){
        super(endpoints.hilos)
    }
}