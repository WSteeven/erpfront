import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { PrendaZona } from '../domain/PrendaZona'
import { endpoints } from 'config/api'

export class PrendaZonaController extends TransaccionSimpleController<PrendaZona> {
    constructor() {
        super(endpoints.prendas_zonas)
    }
}
