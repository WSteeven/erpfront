import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Vacacion } from 'recursosHumanos/vacaciones/domain/Vacacion'
import { endpoints } from 'config/api'

export class VacacionController extends  TransaccionSimpleController<Vacacion>{
  constructor() {
    super(endpoints.vacaciones)
  }
}
