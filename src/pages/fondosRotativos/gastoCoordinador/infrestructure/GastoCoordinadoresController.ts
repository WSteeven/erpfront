import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

import { endpoints } from "config/api";
import { GastoCoordinadores } from "../domain/GastoCoordinadores";

export class GastoCoordinadoresController extends TransaccionSimpleController<GastoCoordinadores>{
  constructor() {
    super(endpoints.gastos)
  }
}
