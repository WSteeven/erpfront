import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { FondoRotativoAutorizacionesFecha } from "../domain/FondoRotativoAutorizacionesFecha";
import { endpoints } from "config/api";

export class FondoRotativoAutorizacionesFechaController extends TransaccionSimpleController<FondoRotativoAutorizacionesFecha>{
  constructor() {
    super(endpoints.fondo_rotativo_autorizaciones_fecha_pdf)
  }
}
