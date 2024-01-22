import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { AsignarAlimentacion } from '../domain/AsignarAlimentacion';
import { endpoints } from 'config/api';

export class AsignarAlimentacionController extends TransaccionSimpleController<AsignarAlimentacion>{
  constructor() {
    super(endpoints.asignar_alimentacion)
  }
}
