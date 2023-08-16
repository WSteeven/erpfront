import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TipoContrato } from "../domain/TipoContrato";
import { endpoints } from "config/api";

export class TipoContratoController extends TransaccionSimpleController<TipoContrato>{
  constructor(){
    super(endpoints.tipo_contrato)
  }
}

