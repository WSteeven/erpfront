import { endpoints } from "config/api";
import { Permiso } from "pages/permisos/domain/Permiso";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

export class PermisoController extends TransaccionSimpleController<Permiso>{
    constructor(){
        super(endpoints.todos_permisos)
    }
}