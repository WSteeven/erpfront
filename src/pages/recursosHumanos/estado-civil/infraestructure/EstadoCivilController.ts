import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { EstadoCivil } from '../domain/EstadoCivil';
import { endpoints } from 'config/api';

export class EstadoCivilController extends TransaccionSimpleController<EstadoCivil> {
  constructor() {
    super(endpoints.estado_civil)
  }
}

