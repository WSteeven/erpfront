import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoAntecedenteFamiliar } from '../domain/TipoAntecedenteFamiliar'
import { endpoints } from 'config/api'

export class TipoAntecedenteFamiliarController extends TransaccionSimpleController<TipoAntecedenteFamiliar> {
  constructor() {
    super(endpoints.tipos_antecedentes_familiares)
  }
}

