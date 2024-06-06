import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoFactorRiesgo } from '../domain/TipoFactorRiesgo'
import { endpoints } from 'config/api'

export class TipoFactorRiesgoController extends TransaccionSimpleController<TipoFactorRiesgo> {
  constructor() {
    super(endpoints.tipos_factores_riesgos)
  }
}

