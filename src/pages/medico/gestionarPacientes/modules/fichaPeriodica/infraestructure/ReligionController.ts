import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Religion } from '../domain/Religion'
import { endpoints } from 'config/api'

export class ReligionController extends TransaccionSimpleController<Religion>{
  constructor() {
    super(endpoints.religiones)
  }
}

