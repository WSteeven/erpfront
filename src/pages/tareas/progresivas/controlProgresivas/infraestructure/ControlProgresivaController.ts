import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ControlProgresiva } from '../domain/ControlProgresiva'
import { endpoints } from 'config/api'

export class ControlProgresivaController extends TransaccionSimpleController<ControlProgresiva> {
  constructor() {
    super(endpoints.progresivas)
  }
}
