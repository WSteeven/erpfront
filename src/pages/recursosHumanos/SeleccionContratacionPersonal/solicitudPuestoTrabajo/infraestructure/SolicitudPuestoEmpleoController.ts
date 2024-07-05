import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { SolicitudPuestoEmpleo } from '../domain/SolicitudPuestoEmpleo';
import { endpoints } from 'config/api';

export class SolicitudPuestoEmpleoController extends TransaccionSimpleController<SolicitudPuestoEmpleo> {
  constructor() {
    super(endpoints.solicitud_puesto_empleo)
  }
}

