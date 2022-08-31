import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'
import { TipoElemento } from '../domain/TipoElemento'
import { endpoints } from 'config/api'

export class TipoElementoController extends TransaccionSimpleController<TipoElemento> {
  constructor() {
    super(endpoints.tipos_elementos)
  }
}
