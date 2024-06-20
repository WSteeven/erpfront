import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Cliente } from 'sistema/clientes/domain/Cliente';

export class ClientesPrefacturasController extends TransaccionSimpleController<Cliente> {
    constructor() {
        super(endpoints.clientes_prefacturas)
    }
}