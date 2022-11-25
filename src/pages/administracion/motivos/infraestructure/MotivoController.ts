import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Motivo } from "../domain/Motivo";
import { endpoints } from "config/api";

export class MotivoController extends TransaccionSimpleController<Motivo>{
    constructor(){
        super(endpoints.motivos)
    }
}