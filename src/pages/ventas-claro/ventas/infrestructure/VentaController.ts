import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Venta } from "../domain/Venta";
import { endpoints } from "config/api";

export class VentaController extends TransaccionSimpleController<Venta>{
  constructor() {
    super(endpoints.ventas)
  }
}
