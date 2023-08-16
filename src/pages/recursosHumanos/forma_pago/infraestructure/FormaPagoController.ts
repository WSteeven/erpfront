import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { FormaPago } from "../domain/FormaPago";
import { endpoints } from "config/api";

export class FormaPagoController extends TransaccionSimpleController<FormaPago>{
  constructor(){
    super(endpoints.forma_pago)
  }
}

