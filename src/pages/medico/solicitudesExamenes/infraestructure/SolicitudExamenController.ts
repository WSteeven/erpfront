import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SolicitudExamen } from '../domain/SolicitudExamen'
import { endpoints } from 'config/api'

export class SolicitudExamenController extends TransaccionSimpleController<SolicitudExamen>{
  constructor() {
    super(endpoints.solicitudes_examenes)
  }
}
