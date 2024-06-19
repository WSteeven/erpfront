import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';

export class UltimoSaldoController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.ultimo_saldo)
  }
}
