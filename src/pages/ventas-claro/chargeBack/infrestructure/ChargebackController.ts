import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Chargeback } from "../domain/Chargeback";
import { endpoints } from "config/api";

export class ChargebackController extends TransaccionSimpleController<Chargeback>{
  constructor() {
    super(endpoints.chargebacks)
  }
}
