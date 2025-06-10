import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SolicitudDescuento } from '../domain/SolicitudDescuento'
import { endpoints } from 'config/api'

export class SolicitudDescuentoController extends TransaccionSimpleController<SolicitudDescuento> {
    constructor() {
        super(endpoints.solicitudes_descuentos)
    }
}
