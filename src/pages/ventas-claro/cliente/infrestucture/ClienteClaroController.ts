import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { ClienteClaro } from '../domain/ClienteClaro';

export class ClienteClaroController extends TransaccionSimpleController<ClienteClaro> {
  constructor() {
    super(endpoints.clientes_claro)
  }
}

