import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Pais } from '../domain/pais';
import { endpoints } from 'config/api';

export class PaisController extends TransaccionSimpleController<Pais> {
  constructor() {
    super(endpoints.paises)
  }
}
