import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { UnidadMedida } from "../domain/UnidadMedida";
import { endpoints } from "config/api";

export class UnidadMedidaController extends TransaccionSimpleController<UnidadMedida>{
  constructor(){
    super(endpoints.unidades_medidas)
  }
}


