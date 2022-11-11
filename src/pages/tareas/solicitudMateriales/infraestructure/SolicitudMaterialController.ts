import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { SolicitudMaterial } from '../domain/SolicitudMaterial'

export class SolicitudMaterialController extends TransaccionSimpleController<SolicitudMaterial> {
    constructor() {
        super(endpoints.subtareas)
    }
}
