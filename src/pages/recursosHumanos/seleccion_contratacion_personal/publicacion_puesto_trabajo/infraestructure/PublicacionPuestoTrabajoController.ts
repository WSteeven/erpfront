import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { PublicacionPuestoTrabajo } from '../domain/PublicacionPuestoTrabajo';
import { endpoints } from 'config/api';

export class PublicacionPuestoTrabajoController extends TransaccionSimpleController<PublicacionPuestoTrabajo> {
  constructor() {
    super(endpoints.publicacion_puesto_empleo)
  }
}

