import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Anticipo } from '../domain/Anticipo';
import { endpoints } from 'config/api';

export class AnticipoController extends TransaccionSimpleController<Anticipo> {
  constructor() {
    super(endpoints.anticipo)
  }
}

