import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { RestriccionPrendaZona } from '../domain/RestriccionPrendaZona'
import { endpoints } from 'config/api'

export class RestriccionPrendaZonaController extends TransaccionSimpleController<RestriccionPrendaZona> {
    constructor() {
        super(endpoints.restricciones_prendas_zonas)
    }
}
