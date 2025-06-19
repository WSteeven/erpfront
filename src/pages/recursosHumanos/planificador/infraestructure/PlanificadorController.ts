import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Planificador } from 'recursosHumanos/planificador/domain/Planificador'
import { endpoints } from 'config/api'

export class PlanificadorController extends TransaccionSimpleController<Planificador>{ constructor()
{
  super(endpoints.planificadores)
} }
