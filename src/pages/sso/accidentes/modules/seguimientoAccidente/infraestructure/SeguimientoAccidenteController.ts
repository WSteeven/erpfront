import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SeguimientoAccidente } from '../domain/SeguimientoAccidente'
import { endpoints } from 'config/api'

export class SeguimientoAccidenteController extends TransaccionSimpleController<SeguimientoAccidente> {
    constructor() {
        super(endpoints.seguimientos_accidentes)
    }
}
