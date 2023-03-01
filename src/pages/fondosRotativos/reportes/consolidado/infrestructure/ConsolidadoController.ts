import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Consolidado } from "../domain/Consolidado";
import { endpoints } from "config/api";

export class ConsolidadoController extends TransaccionSimpleController<Consolidado>{
  constructor() {
    super(endpoints.fondo_rotativo_autorizaciones_fecha_pdf)
  }
}
