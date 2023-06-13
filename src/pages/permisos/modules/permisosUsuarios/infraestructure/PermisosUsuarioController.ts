import { endpoints } from "config/api";
import { endianness } from "os";
import { Permiso } from "pages/permisos/domain/Permiso";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";


export class PermisosUsuarioController extends TransaccionSimpleController<Permiso>{
    constructor(){
        super(endpoints.permisos_roles_usuario)
    }
}