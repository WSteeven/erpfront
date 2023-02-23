import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Trabajo } from '../domain/Trabajo'

export class TrabajoController extends TransaccionSimpleController<Trabajo> {
  constructor() {
    super(endpoints.trabajos)
  }
}
