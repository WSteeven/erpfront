import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { SolicitudVacacion } from '../domain/SolicitudVacacion';
import { endpoints } from 'config/api';

export class SolicitudVacacionController extends TransaccionSimpleController<SolicitudVacacion> {
  constructor() {
    super(endpoints.solicitudes_vacaciones)
  }
}

