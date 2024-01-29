import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";

export class ConfiguracionExamenCategoriaController extends TransaccionSimpleController<any>{
  constructor() {
    super(endpoints.configuraciones_examenes_categorias)
  }
}
