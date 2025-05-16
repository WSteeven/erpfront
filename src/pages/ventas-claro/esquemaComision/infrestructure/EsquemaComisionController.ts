import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { EsquemaComision } from '../domain/EsquemaComision';

export class EsquemaComisionController extends TransaccionSimpleController<EsquemaComision> {
  constructor() {
    super(endpoints.esquema_comision)
  }
}
