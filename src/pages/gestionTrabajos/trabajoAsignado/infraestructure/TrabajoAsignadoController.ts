import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
// import { Trabajo } from 'trabajos/domain/Trabajo'
import { endpoints } from 'config/api'

export class TrabajoAsignadoController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.trabajo_asignado)
  }
}
