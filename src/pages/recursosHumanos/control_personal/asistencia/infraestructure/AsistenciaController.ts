import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Asistencia } from '../domain/Asistencia';
import { endpoints } from 'config/api';

export class AsistenciaController extends TransaccionSimpleController<Asistencia> {
  constructor() {
    super(endpoints.asistencias);
  }
}
