import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Etapa } from "../domain/Etapa";
import { endpoints } from "config/api";

export class EtapaController extends TransaccionSimpleController<Etapa>{
  constructor(){
    super(endpoints.etapas)
  }
}
