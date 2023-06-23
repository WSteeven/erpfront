import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Periodo } from "../domain/Periodo";
import { endpoints } from "config/api";

export class PeriodoController extends TransaccionSimpleController<Periodo>{
  constructor(){
    super(endpoints.estado_permiso_empleado)
  }
}

