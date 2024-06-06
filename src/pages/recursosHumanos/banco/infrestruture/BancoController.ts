import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Banco } from "../domain/Banco";
import { endpoints } from "config/api";

export class BancoController extends TransaccionSimpleController<Banco>{
  constructor() {
    super(endpoints.banco)
  }
}

