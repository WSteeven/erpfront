import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoCuestionario } from '../domain/TipoCuestionario'
import { endpoints } from 'config/api'

export class TipoCuestionarioController extends TransaccionSimpleController<TipoCuestionario>{
  constructor() {
    super(endpoints.tipos_cuestionarios)
  }
}
