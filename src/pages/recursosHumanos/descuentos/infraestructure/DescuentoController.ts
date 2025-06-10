import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Descuento } from 'recursosHumanos/descuentos/domain/Descuento'
import { endpoints } from 'config/api'

export class DescuentoController extends TransaccionSimpleController<Descuento>{
  constructor() {
    super(endpoints.descuentos)
  }
}
