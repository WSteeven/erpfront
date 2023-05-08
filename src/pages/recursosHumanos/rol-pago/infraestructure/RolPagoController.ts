import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { RolPago } from "../domain/RolPago";
import { endpoints } from "config/api";

export class RolPagoController extends TransaccionSimpleController<RolPago>{
  constructor(){
    super(endpoints.rol_pago)
  }
}

