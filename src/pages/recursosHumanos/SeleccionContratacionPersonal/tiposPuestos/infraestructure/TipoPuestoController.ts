import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { TipoPuesto } from '../domain/TipoPuesto';
import { endpoints } from 'config/api';

export class TipoPuestoController extends TransaccionSimpleController<TipoPuesto> {
  constructor() {
    super(endpoints.tipos_puestos)
  }
}

