import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Conductor } from '../domain/Conductor'

export class ConductorController extends TransaccionSimpleController<Conductor> {
    constructor() {
        super(endpoints.conductores)
    }
}