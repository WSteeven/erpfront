import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';

export class ValorAcreditarEmpleadoController extends TransaccionSimpleController<any>{
  constructor() {
    super(endpoints.monto_acreditar_usuario)
  }
}
