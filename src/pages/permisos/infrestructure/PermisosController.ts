import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";
import { Permiso } from "../domain/Permiso";



export class PermisosController extends TransaccionSimpleController<Permiso>{
  constructor() {
    super(endpoints.permisos_administrar)
  }
}
