import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import Coordenada from '../domain/Coordenada';
import { endpoints } from 'config/api';

export class CoordenadaController extends TransaccionSimpleController<Coordenada> {
  constructor() {
    super(endpoints.coordenadas)
  }
}
