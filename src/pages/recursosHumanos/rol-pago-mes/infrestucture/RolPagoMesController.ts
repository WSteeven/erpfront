import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { RolPagoMes } from "../domain/RolPagoMes";
import { endpoints } from "config/api";

export class RolPagoMesController extends TransaccionSimpleController<RolPagoMes>{
  constructor(){
    super(endpoints.rol_pago_mes)
  }
}

