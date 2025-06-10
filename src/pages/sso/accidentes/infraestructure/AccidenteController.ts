import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Accidente } from '../domain/Accidente'
import { endpoints } from 'config/api'

export class AccidenteController extends TransaccionSimpleController<Accidente> {
    constructor() {
        super(endpoints.accidentes)
    }
}
