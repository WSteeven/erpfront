import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TipoTransaccion } from "../domain/TipoTransaccion";
import { endpoints } from "config/api";

export class TipoTransaccionController extends TransaccionSimpleController<TipoTransaccion>{
    constructor(){
        super(endpoints.tipos_transacciones)
    }
}