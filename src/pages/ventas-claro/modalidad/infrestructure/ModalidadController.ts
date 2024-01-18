import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Modalidad } from "../domain/Modalidad";
import { endpoints } from "config/api";

export class ModalidadController extends TransaccionSimpleController<Modalidad>{
  constructor() {
    super(endpoints.modalidad)
  }
}
