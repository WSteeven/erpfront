import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { DetalleProductoTransaccion } from '../domain/DetalleProductoTransaccion'
import { endpoints } from 'config/api'

export class DetalleProductoTransaccionController extends TransaccionSimpleController<DetalleProductoTransaccion>{
    constructor() {
        super(endpoints.detalle_producto_transaccion)
    }
}