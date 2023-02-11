import { endpoints } from 'config/api'
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class SelectorController extends TransaccionSimpleController<EntidadAuditable> {
  constructor(endpoint: keyof typeof endpoints) {
    super(endpoints[endpoint])
  }
}
