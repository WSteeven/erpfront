import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TipoChargeBack } from "../domain/TipoChargeBack";
import { endpoints } from "config/api";

export class TipoChargeBackController extends TransaccionSimpleController<TipoChargeBack>{
  constructor() {
    super(endpoints.tipo_chargebacks)
  }
}
