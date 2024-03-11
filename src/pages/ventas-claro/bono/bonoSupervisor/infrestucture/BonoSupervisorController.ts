import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";
import { BonoSupervisor } from "../domain/BonoSupervisor";

export class BonoSupervisorController extends TransaccionSimpleController<BonoSupervisor>{
  constructor(){
    super(endpoints.bonos_porcentuales)
  }
}

