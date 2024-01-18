import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { CobroJP } from "../domain/CobroJP";
import { endpoints } from "config/api";

export class CobroJPController extends TransaccionSimpleController<CobroJP>{
  constructor() {
    super(endpoints.cobrojp)
  }
}
