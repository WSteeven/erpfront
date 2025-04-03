import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Multa } from '../domain/Multa';
import { endpoints } from 'config/api';

export class MultaController extends TransaccionSimpleController<Multa> {
  constructor() {
    super(endpoints.multa)
  }
}

