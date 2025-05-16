import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Inspeccion } from '../domain/Inspeccion'
import { endpoints } from 'config/api'

export class InspeccionController extends TransaccionSimpleController<Inspeccion> {
    constructor() {
        super(endpoints.inspecciones)
    }
}
