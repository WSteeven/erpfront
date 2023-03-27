import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

import { endpoints } from "config/api";
import { Gasto } from "../domain/Gasto";

export class VisualizarGastoController extends TransaccionSimpleController<Gasto>{
  constructor() {
    super(endpoints.gastos)
  }
}
