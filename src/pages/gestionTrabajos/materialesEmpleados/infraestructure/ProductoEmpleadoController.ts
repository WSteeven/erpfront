import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ProductoEmpleado } from '../domain/ProductoEmpleado'
import { endpoints } from 'config/api'

export class ProductoEmpleadoController extends TransaccionSimpleController<ProductoEmpleado> {
  constructor() {
    super(endpoints.productos_empleados)
  }
}
