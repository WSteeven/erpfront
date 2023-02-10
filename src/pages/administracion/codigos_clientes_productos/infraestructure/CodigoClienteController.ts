import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CodigoCliente } from '../domain/CodigoCliente'
import { endpoints } from 'config/api'

export class CodigoClienteController extends TransaccionSimpleController<CodigoCliente>{
    constructor() {
        super(endpoints.codigos_clientes)
    }
}