import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Ram } from '../domain/Ram'
import { endpoints } from 'config/api'

export class RamController extends TransaccionSimpleController<Ram>{
    constructor() {
        super(endpoints.rams)
    }
}