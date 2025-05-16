import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { AcreditacionSemana } from '../domain/AcreditacionSemana';
import { endpoints } from 'config/api';

export class AcreditacionSemanaController extends TransaccionSimpleController<AcreditacionSemana> {
  constructor() {
    super(endpoints.acreditacion_semana)
  }
}
