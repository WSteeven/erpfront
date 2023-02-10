import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Subtarea } from '../domain/Subtarea'

export class SubtareaController extends TransaccionSimpleController<Subtarea> {
  constructor() {
    super(endpoints.subtareas)
  }
}
