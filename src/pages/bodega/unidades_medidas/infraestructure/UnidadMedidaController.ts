import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
<<<<<<< HEAD
import { UnidadMedida} from "../domain/UnidadMedida";
import { endpoints } from "config/api";

export class UnidadMedidaController extends TransaccionSimpleController<UnidadMedida>{
    constructor(){
        super(endpoints.unidades_medidas)
    }
}

=======
import { UnidadMedida } from "../domain/UnidadMedida";
import { endpoints } from "config/api";

export class UnidadMedidaController extends TransaccionSimpleController<UnidadMedida>{
  constructor(){
    super(endpoints.unidades_medidas)
  }
}


>>>>>>> 523df83a27c9d3cf84816a0d2d36988a6d032620
