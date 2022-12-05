import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Proyecto } from '../domain/Proyecto'
import { endpoints } from 'config/api'

export class ProyectoController extends TransaccionSimpleController<Proyecto> {
  constructor() {
    super(endpoints.proyectos)
  }
}
