import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { TipoSaldo } from '../domain/TipoSaldo';

export class TipoSaldoController extends TransaccionSimpleController<TipoSaldo> {
  constructor() {
    super(endpoints.tipo_saldo)
  }
}
