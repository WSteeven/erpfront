import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

import { endpoints } from "config/api";
import { GastoContabilidad } from "../domain/GastoContabilidad";

export class GastoContabilidadController extends TransaccionSimpleController<GastoContabilidad>{
  constructor() {
    super(endpoints.gastocontabilidad)+'?fecha_inicio=2021-01-01&fecha_fin=2021-01-31'
  }
}
