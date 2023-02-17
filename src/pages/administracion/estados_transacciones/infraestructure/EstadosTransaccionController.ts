import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EstadosTransaccion } from '../domain/EstadosTransaccion'
import { endpoints } from 'config/api'

export class EstadosTransaccionController extends TransaccionSimpleController<EstadosTransaccion>{
    constructor() {
        super(endpoints.estados_transacciones)
    }
}
