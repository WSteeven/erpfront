import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Formulario } from 'capacitacion/forms/domain/Formulario'
import { endpoints } from 'config/api'

export class FormularioController extends TransaccionSimpleController<Formulario>{
  constructor() {
    super(endpoints.formularios)
  }
}
