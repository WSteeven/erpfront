import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Ventas } from "../domain/Ventas";
import { endpoints } from "config/api";

export class VentasController extends TransaccionSimpleController<Ventas>{
  constructor() {
    super(endpoints.ventas)
  }
}
