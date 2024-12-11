import {
  TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { VisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/VisitaDomiciliaria'
import { endpoints } from 'config/api'

export class VisitaDomiciliariaController extends TransaccionSimpleController<VisitaDomiciliaria>{
  constructor() {
    super(endpoints.visita_domiciliaria)
  }
}
