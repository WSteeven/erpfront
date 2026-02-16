import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoCoordenada } from '../domain/TipoCoordenada'
import { endpoints } from 'config/api'

export class TipoCoordenadaController extends TransaccionSimpleController<TipoCoordenada> {
  constructor() {
    super(endpoints.tipos_coordenadas)
  }
}
