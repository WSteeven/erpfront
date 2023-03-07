import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TipoFondo } from "../domain/TipoFondo";
import { endpoints } from "config/api";

export class TipoFondoController extends TransaccionSimpleController<TipoFondo>{
  constructor() {
    super(endpoints.tipo_fondo)
  }
}
