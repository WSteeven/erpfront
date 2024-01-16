import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { DetalleAlimentacion } from '../domain/DetalleAlimentacion'

export class DetalleAlimentacionController extends TransaccionSimpleController<DetalleAlimentacion>{
    constructor() {
        super(endpoints.detalle_alimentacion)
    }
}
