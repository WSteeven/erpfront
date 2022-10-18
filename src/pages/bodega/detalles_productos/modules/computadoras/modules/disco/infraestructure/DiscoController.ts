import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Disco } from "../domain/Disco";
import { endpoints } from "config/api";

export class DiscoController extends TransaccionSimpleController<Disco>{
    constructor(){
        super(endpoints.discos)
    }
}