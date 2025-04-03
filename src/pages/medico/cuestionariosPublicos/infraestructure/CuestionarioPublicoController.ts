import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CuestionarioPublico } from '../domain/CuestionarioPublico'
import { endpoints } from 'config/api'

export class CuestionarioPublicoController extends TransaccionSimpleController<CuestionarioPublico>{
  constructor() {
    super(endpoints.cuestionarios_publicos)
  }
}
