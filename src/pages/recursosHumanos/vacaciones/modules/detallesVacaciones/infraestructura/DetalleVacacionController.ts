import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { DetalleVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/DetalleVacacion'
import { endpoints } from 'config/api'

export  class DetalleVacacionController extends TransaccionSimpleController<DetalleVacacion>{
  constructor() {
    super(endpoints.detalles_vacaciones)
  }
}
