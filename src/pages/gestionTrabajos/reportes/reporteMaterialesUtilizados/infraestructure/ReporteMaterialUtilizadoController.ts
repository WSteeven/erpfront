import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ReporteMaterialUtilizado } from '../domain/ReporteMaterialUtilizado'
import { endpoints } from 'config/api'

export class ReporteMaterialUtilizadoController extends TransaccionSimpleController<ReporteMaterialUtilizado> {
  constructor() {
    super(endpoints.reporte_materiales_utilizados)
  }
}
