import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { BancoPostulante } from "../domain/BancoPostulante";
import { endpoints } from "config/api";

export class BancoPostulanteController extends TransaccionSimpleController<BancoPostulante> {
  constructor() {
    super(endpoints.bancos_postulantes)
  }
}
