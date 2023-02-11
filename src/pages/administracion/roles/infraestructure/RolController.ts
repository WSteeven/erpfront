import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Rol } from '../domain/Rol'
import { endpoints } from 'config/api'

export class RolController extends TransaccionSimpleController<Rol>{
    constructor() {
        super(endpoints.allroles)
    }
}