import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { PlanVacacion } from 'recursosHumanos/planVacacion/domain/PlanVacacion'
import { endpoints } from 'config/api'

export class PlanVacacionController extends  TransaccionSimpleController<PlanVacacion>{
  constructor() {
    super(endpoints.planes_vacaciones)
  }
}
