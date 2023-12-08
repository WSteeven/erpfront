import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Areas } from "../domain/Areas";
import { endpoints } from "config/api";

export class AreasController extends TransaccionSimpleController<Areas>{
  constructor(){
    super(endpoints.areas)
  }
}

