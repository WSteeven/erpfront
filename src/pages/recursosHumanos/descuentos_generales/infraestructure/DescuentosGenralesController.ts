import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { DescuentosGenrales } from '../domain/DescuentosGenerales';
import { endpoints } from 'config/api';

export class DescuentosGenralesController extends TransaccionSimpleController<DescuentosGenrales> {
  constructor() {
    super(endpoints.descuentos_generales)
  }
}

