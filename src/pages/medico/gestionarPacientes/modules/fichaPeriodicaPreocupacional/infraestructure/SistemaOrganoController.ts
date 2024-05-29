import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SistemaOrgano } from '../domain/SistemaOrgano'
import { endpoints } from 'config/api'

export class SistemaOrganoController extends TransaccionSimpleController<SistemaOrgano> {
  constructor() {
    super(endpoints.sistemas_organos)
  }
}

