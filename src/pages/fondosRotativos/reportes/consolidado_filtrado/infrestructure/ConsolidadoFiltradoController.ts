import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { ConsolidadoFiltrado } from '../domain/ConsolidadoFiltrado';
import { endpoints } from 'config/api';

export class ConsolidadoFiltradoController extends TransaccionSimpleController<ConsolidadoFiltrado> {
  constructor() {
    super(endpoints.fondo_rotativo_autorizaciones_fecha_pdf)
  }
}
