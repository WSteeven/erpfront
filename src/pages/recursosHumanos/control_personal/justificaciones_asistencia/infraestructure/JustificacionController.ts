import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Justificacion } from '../domain/Justificacion'
import { endpoints } from 'config/api'

export class JustificacionController extends TransaccionSimpleController<Justificacion> {
  constructor() {
    super(endpoints.atrasos)
  }
}
