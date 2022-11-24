import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { SubtipoTransaccion } from "../domain/SubtipoTransaccion";
import { endpoints } from "config/api";

export class SubtipoTransaccionController extends TransaccionSimpleController<SubtipoTransaccion>{
    constructor(){
        super(endpoints.subtipos_transacciones)
    }
}