import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Saldo } from "../domain/Saldo";
import { endpoints } from "config/api";

export class SaldoController extends TransaccionSimpleController<Saldo>{
  constructor() {
    super(endpoints.saldo)
  }
}
