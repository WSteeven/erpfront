import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Visitante } from '../domain/Visitante'
import { endpoints } from 'config/api'

export class VisitanteController extends TransaccionSimpleController<Visitante> {
  constructor() {
    super(endpoints.visitantes)
  }
}
