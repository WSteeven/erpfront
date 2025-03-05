import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Bitacora } from '../doman/Bitacora'
import { endpoints } from 'config/api'

export class BitacoraController extends TransaccionSimpleController<Bitacora> {
    constructor() {
        super(endpoints.bitacoras)
    }
}
