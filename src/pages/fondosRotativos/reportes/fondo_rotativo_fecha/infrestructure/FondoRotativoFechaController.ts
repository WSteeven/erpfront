import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { FondoRotativoFecha } from "../domain/FondoRotativoFecha";
import { endpoints } from "config/api";

export class FondoRotativoFechaController extends TransaccionSimpleController<FondoRotativoFecha>{
  constructor() {
    super(endpoints.fondo_rotativo_fecha)
  }
}
