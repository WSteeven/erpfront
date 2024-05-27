import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CitaMedica } from '../domain/CitaMedica'
import { endpoints } from 'config/api'

export class CitaMedicaController extends TransaccionSimpleController<CitaMedica> {
  constructor() {
    super(endpoints.citas_medicas)
  }
}
