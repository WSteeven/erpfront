import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { BonoVentas } from '../domain/BonoVenta';

export class BonoMensualCumplimientoController extends TransaccionSimpleController<BonoVentas> {
  constructor() {
    super(endpoints.bonos)
  }
}

