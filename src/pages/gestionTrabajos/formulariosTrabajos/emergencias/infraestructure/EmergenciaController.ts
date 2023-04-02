import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Emergencia } from '../domain/Emergencia'
import { endpoints } from 'config/api'

export class EmergenciaController extends TransaccionSimpleController<Emergencia> {
  constructor() {
    super(endpoints.seguimientos)
  }
}
