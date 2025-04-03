import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Proforma } from '../domain/Proforma';
import { endpoints } from 'config/api';

export class ProformaController extends TransaccionSimpleController<Proforma> {
  constructor() {
    super(endpoints.proformas)
  }
}
