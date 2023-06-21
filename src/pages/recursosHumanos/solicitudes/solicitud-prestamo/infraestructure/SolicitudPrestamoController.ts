import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { SolicitudPrestamo } from "../domain/SolicitudPrestamo";
import { endpoints } from "config/api";

export class SolicitudPrestamoController extends TransaccionSimpleController<SolicitudPrestamo>{
  constructor(){
    super(endpoints.solicitud_prestamo_empresarial)
  }
}

