import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Garaje } from "../domain/Garaje";
import { endpoints } from "config/api";

export class GarajeController extends TransaccionSimpleController<Garaje>{
    constructor(){
        super(endpoints.garajes)
    }
}