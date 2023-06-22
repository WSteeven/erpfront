import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { VisualizarTransferencia } from '../domain/VisualizarTransferencia';

export class VisualizarTransferenciaController extends TransaccionSimpleController<VisualizarTransferencia>{
  constructor() {
    super(endpoints.transferencia)
  }
}
