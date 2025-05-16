import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CategoriaExamenFisico } from '../domain/CategoriaExamenFisico'
import { endpoints } from 'config/api'

export class CategoriaExamenFisicoController extends TransaccionSimpleController<CategoriaExamenFisico> {
  constructor() {
    super(endpoints.categorias_examenes_fisicos)
  }
}

