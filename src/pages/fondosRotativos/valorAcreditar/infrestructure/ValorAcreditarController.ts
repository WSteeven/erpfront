import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { ValorAcreditar } from "../domain/ValorAcreditar";
import { endpoints } from "config/api";

export class ValorAcreditarController extends TransaccionSimpleController<ValorAcreditar>{
  constructor() {
    super(endpoints.valor_acreditar)
  }
}
