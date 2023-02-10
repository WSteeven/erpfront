import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Pedido } from '../domain/Pedido'
import { endpoints } from 'config/api'

export class PedidoController extends TransaccionSimpleController<Pedido>{
    constructor() {
        super(endpoints.pedidos)
    }
}