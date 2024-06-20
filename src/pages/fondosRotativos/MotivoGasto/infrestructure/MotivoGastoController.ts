import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { MotivoGasto } from '../domain/MotivoGasto';
import { endpoints } from 'config/api';

export class MotivoGastoController extends TransaccionSimpleController<MotivoGasto> {
  constructor() {
    super(endpoints.motivo_gasto)
  }
}
