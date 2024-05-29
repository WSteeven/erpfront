import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Receta } from '../domain/Receta'

export class RecetaController extends TransaccionSimpleController<Receta>{
  constructor() {
    super(endpoints.recetas)
  }
}

