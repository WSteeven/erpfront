import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Cargo } from '../domain/Cargo';
import { endpoints } from 'config/api';

export class CargoController extends TransaccionSimpleController<Cargo> {
  constructor() {
    super(endpoints.cargos)
  }
}

