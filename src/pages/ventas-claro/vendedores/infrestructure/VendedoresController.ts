import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Vendedores } from "../domain/Vendedores";
import { endpoints } from "config/api";

export class VendedoresController extends TransaccionSimpleController<Vendedores>{
  constructor() {
    super(endpoints.vendedor)
  }
}
