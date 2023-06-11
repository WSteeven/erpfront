import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Prestamo } from "../domain/Prestamo";
import { endpoints } from "config/api";

export class PrestamoController extends TransaccionSimpleController<Prestamo>{
  constructor(){
    super(endpoints.prestamo_anticipo)
  }
}

