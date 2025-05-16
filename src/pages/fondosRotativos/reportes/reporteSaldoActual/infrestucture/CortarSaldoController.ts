import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';

export class CortarSaldolController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.cortar_saldo)
  }
}
