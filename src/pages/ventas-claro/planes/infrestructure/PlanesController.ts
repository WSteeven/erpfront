import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Planes } from '../domain/Planes';
import { endpoints } from 'config/api';

export class PlanesController extends TransaccionSimpleController<Planes> {
  constructor() {
    super(endpoints.planes)
  }
}
