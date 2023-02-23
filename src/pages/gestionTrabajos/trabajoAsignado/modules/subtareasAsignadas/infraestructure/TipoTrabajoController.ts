import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Subtarea } from 'subtareas/domain/Subtarea'
import { endpoints } from 'config/api'

export class TrabajoAsignadoController extends TransaccionSimpleController<Subtarea> {
  constructor() {
    super(endpoints.trabajo_asignado)
  }
}
