import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Alimentacion } from '../domain/Alimentacion'
import { endpoints } from 'config/api'

export class AlimentacionController extends TransaccionSimpleController<Alimentacion>{
    constructor() {
        super(endpoints.alimentacion)
    }
}
