import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Acreditacion } from "../domain/Acreditacion";
import { endpoints } from "config/api";

export class AcreditacionController extends TransaccionSimpleController<Acreditacion>{
  constructor() {
    super(endpoints.acreditacion)
  }
}
