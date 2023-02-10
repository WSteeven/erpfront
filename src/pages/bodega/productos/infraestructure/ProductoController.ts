import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Producto } from '../domain/Producto'
import { endpoints } from 'config/api'

export class ProductoController extends TransaccionSimpleController<Producto>{
  constructor() {
    super(endpoints.productos)
  }
}
