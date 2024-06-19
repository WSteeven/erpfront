import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { EscenarioVentaJP } from '../domain/EscenarioVentaJP';

export class EscenarioVentaJPController extends TransaccionSimpleController<EscenarioVentaJP> {
  constructor() {
    super(endpoints.escenario_venta_jp)
  }
}
