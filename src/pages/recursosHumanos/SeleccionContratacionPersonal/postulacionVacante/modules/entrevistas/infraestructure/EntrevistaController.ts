import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Entrevista } from "../domain/Entrevista";
import { endpoints } from "config/api";

export class EntrevistaController extends TransaccionSimpleController<Entrevista>{
  constructor(){
    super(endpoints.entrevistas);
  }
}
