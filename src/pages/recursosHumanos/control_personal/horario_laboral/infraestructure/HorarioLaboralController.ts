import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { HorarioLaboral } from '../domain/HorarioLaboral';
import { endpoints } from 'config/api';

export class HorarioLaboralController extends TransaccionSimpleController<HorarioLaboral> {
  constructor() {
    super(endpoints.horarioLaboral);
  }
}
