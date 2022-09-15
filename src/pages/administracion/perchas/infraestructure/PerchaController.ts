import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Percha } from "../domain/Percha";
import { endpoints } from "config/api";

export class PerchaController extends TransaccionSimpleController<Percha>{
    constructor(){
        super(endpoints.perchas)
    }
}