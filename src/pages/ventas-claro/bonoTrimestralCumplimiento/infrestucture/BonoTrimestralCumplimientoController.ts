import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { BonoTrimestralCumplimiento } from '../domain/BonoTrimestralCumplimiento';
import { endpoints } from 'config/api';

export class BonoTrimestralCumplimientoController extends TransaccionSimpleController<BonoTrimestralCumplimiento> {
  constructor() {
    super(endpoints.bono_trimestral_cumplimiento)
  }
}

