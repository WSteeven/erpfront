import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Comision } from '../domain/Comision';
import { endpoints } from 'config/api';

export class ComisionController extends TransaccionSimpleController<Comision> {
  constructor() {
    super(endpoints.comisiones)
  }
}
