import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { TipoAntecedente } from '../domain/TipoAntecedente'

export class TipoAntecedenteController extends TransaccionSimpleController<TipoAntecedente> {
  constructor() {
    super(endpoints.tipos_antecedentes)
  }
}

