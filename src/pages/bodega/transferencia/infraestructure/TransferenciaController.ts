import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Transferencia } from "../domain/Transferencia";
import { endpoints } from "config/api";

export class TransferenciaController extends TransaccionSimpleController<Transferencia>{
    constructor(){
        super(endpoints.transferencias)
    }
}