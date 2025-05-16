import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Certificacion } from '../domain/Certificacion'
import { endpoints } from 'config/api'

export class CertificacionController extends TransaccionSimpleController<Certificacion> {
  constructor() {
    super(endpoints.certificaciones)
  }
}
