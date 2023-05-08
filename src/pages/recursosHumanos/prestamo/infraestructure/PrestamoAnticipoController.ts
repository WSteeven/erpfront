import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { PrestamoAnticipo } from "../domain/Prestamo";
import { endpoints } from "config/api";

export class PrestamoAnticipoController extends TransaccionSimpleController<PrestamoAnticipo>{
  constructor(){
    super(endpoints.prestamo_anticipo)
  }
}

