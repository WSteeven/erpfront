import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Transaccion} from "../domain/Transaccion";
import { endpoints } from "config/api";

export class TransaccionIngresoController extends TransaccionSimpleController<Transaccion>{
    constructor(){
        super(endpoints.transacciones_ingresos)
    }
}
