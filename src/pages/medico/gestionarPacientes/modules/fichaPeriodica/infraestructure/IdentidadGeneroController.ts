import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { IdentidadGenero } from '../domain/IdentidadGenero'
import { endpoints } from 'config/api'

export class IdentidadGeneroController extends TransaccionSimpleController<IdentidadGenero>{
  constructor() {
    super(endpoints.identidades_generos)
  }
}

