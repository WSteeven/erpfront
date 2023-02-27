import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Notificacion } from "../domain/Notificacion";
import { endpoints } from "config/api";

export class NotificacionController extends TransaccionSimpleController<Notificacion>{
  constructor(){
    super(endpoints.notificaciones)
  }
}
