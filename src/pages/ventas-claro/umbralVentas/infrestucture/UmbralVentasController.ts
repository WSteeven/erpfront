import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";
import { UmbralVentas } from "../domain/UmbralVentas";

export class UmbralVentasController extends TransaccionSimpleController<UmbralVentas>{
  constructor(){
    super(endpoints.umbral_ventas)
  }
}

