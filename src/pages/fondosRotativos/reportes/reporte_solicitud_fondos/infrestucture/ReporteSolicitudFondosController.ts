import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { ReporteSolicitudFondos } from '../domain/ReporteSolicitudFondos';


export class ReporteSolicitudFondosController extends TransaccionSimpleController<ReporteSolicitudFondos> {
  constructor() {
    super(endpoints.reporte_solicitud_fondo_pdf)
  }
}
