import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Pagos } from "../domain/Pagos";
import { endpoints } from "config/api";

export class PagosController extends TransaccionSimpleController<Pagos>{
  constructor() {
    super(endpoints.cobrojp)
  }
}
