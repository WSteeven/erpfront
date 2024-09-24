import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Vacante } from '../../vacantes/domain/Vacante';

export class VacanteFavoritaController extends TransaccionSimpleController<Vacante>{
  constructor() {
    super(endpoints.vacantes_favoritas)
  }
}
