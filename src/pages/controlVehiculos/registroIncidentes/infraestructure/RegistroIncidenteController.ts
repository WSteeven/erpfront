import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { RegistroIncidente } from "../domain/RegistroIncidente";
import { endpoints } from "config/api";

export class RegistroIncidenteController extends TransaccionSimpleController<RegistroIncidente>{
  constructor(){
    super(endpoints.registros_incidentes)
  }
}
