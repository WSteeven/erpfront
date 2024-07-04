import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Permiso } from '../domain/Permiso'
import { endpoints } from 'config/api'

export class PermisoController extends TransaccionSimpleController<Permiso>{
    constructor() {
        super(endpoints.permisos_armas)
    }
}
