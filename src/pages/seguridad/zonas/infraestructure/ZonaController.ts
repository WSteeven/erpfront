import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Zona } from '../domain/Zona'

export class ZonaController extends TransaccionSimpleController<Zona> {
    constructor() {
        super(endpoints.zonas)
    }
}
