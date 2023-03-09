import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";
import { Permiso } from "../domain/Permiso";



export class AsignarPermisosController extends TransaccionSimpleController<any>{
  constructor() {
    super(endpoints.asignar_permisos)
  }
}
