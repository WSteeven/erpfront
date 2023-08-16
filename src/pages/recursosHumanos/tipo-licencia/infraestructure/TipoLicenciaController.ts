import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TipoLicencia } from "../domain/TipoLicencia";
import { endpoints } from "config/api";

export class TipoLicenciaController extends TransaccionSimpleController<TipoLicencia>{
  constructor(){
    super(endpoints.tipo_licencia)
  }
}

