import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Rubro } from '../domain/Rubro';
import { endpoints } from 'config/api';

export class RubroController extends TransaccionSimpleController<Rubro> {
  constructor() {
    super(endpoints.rubros)
  }
}

