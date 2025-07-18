import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SeguimientoIncidente } from '../domain/SeguimientoIncidente'
import { endpoints } from 'config/api'

export class SeguimientoIncidenteController extends TransaccionSimpleController<SeguimientoIncidente> {
    constructor() {
        super(endpoints.seguimientos_incidentes)
    }
}
