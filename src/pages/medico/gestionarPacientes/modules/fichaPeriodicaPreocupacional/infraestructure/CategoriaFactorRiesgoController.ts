import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CategoriaFactorRiesgo } from '../domain/CategoriaFactorRiesgo'
import { endpoints } from 'config/api'

export class CategoriaFactorRiesgoController extends TransaccionSimpleController<CategoriaFactorRiesgo> {
  constructor() {
    super(endpoints.categorias_factores_riesgos)
  }
}

