import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { DetalleFondo } from "../domain/DetalleFondo";
import { endpoints } from "config/api";

export class DetalleFondoController extends TransaccionSimpleController<DetalleFondo>{
  constructor() {
    super(endpoints.detalle_fondo)
  }
}
