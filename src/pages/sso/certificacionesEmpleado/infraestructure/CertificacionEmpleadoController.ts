import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CertificacionEmpleado } from '../domain/CertificacionEmpleado'
import { endpoints } from 'config/api'

export class CertificacionEmpleadoController extends TransaccionSimpleController<CertificacionEmpleado> {
  constructor() {
    super(endpoints.certificaciones_empleados)
  }
}
