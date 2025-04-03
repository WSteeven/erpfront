import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Incidente } from '../domain/Incidente'

export class IncidenteController extends TransaccionSimpleController<Incidente> {
    constructor() {
        super(endpoints.incidentes)
    }
}
