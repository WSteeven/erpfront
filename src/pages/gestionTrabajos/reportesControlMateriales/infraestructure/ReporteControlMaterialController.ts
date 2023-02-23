import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ReporteControlMaterial } from '../domain/ReporteControlMaterial'
import { endpoints } from 'config/api'

export class ReporteControlMaterialController extends TransaccionSimpleController<ReporteControlMaterial> {
  constructor() {
    super(endpoints.reportes_control_materiales)
  }
}
