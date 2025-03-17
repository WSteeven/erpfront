import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MiembroZona } from '../domain/MiembroZona'
import { endpoints } from 'config/api'

export class MiembroZonaController extends TransaccionSimpleController<MiembroZona> {
    constructor() {
        super(endpoints.miembros_zonas)
    }
}
