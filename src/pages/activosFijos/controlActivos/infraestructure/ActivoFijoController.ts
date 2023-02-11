import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ActivoFijo } from '../domain/ActivoFijo'
import { endpoints } from 'config/api'

export class ActivoFijoController extends TransaccionSimpleController<ActivoFijo>{
    constructor() {
        super(endpoints.activos_fijos)
    }
}