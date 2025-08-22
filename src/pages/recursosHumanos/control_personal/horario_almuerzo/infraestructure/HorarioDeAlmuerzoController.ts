import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { HorarioDeAlmuerzo } from '../domain/HorarioDeAlmuerzo';
import { endpoints } from 'config/api';

export class HorarioDeAlmuerzoController extends TransaccionSimpleController<HorarioDeAlmuerzo> {
  constructor() {
    super(endpoints.horarioDeAlmuerzo);
  }
}
