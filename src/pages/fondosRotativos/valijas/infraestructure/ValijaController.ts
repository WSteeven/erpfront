import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import {Valija} from '../domain/Valija';

export class ValijaController extends TransaccionSimpleController<Valija> {
  constructor() {
    super(endpoints.valijas)
  }
}
