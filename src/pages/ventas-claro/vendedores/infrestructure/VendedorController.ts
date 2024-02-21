import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Vendedor } from "../domain/Vendedor";
import { endpoints } from "config/api";

export class VendedorController extends TransaccionSimpleController<Vendedor>{
  constructor() {
    super(endpoints.vendedores_claro)
  }
}
