import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Subtarea } from '../domain/Trabajo'

export class TrabajoController extends TransaccionSimpleController<Subtarea> {
  constructor() {
    super(endpoints.trabajos)
  }
}
