import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { SubDetalleFondo } from '../domain/SubDetalleFondo';

export class SubDetalleFondoController extends TransaccionSimpleController<SubDetalleFondo> {
  constructor() {
    super(endpoints.sub_detalle_fondo)
  }
}
