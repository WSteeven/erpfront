import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

import { endpoints } from "config/api";
import { Fondo } from "../domain/Fondo";

export class FondoController extends TransaccionSimpleController<Fondo>{
  constructor() {
    super(endpoints.viaticos)
  }
}
