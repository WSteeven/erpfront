import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ValorCargadoRol } from 'recursosHumanos/valoresCargadosRolEmpleadoMensual/domain/ValorCargadoRol'
import { endpoints } from 'config/api'

export class ValorCargadoRolController extends TransaccionSimpleController<ValorCargadoRol>{
  constructor() {
    super(endpoints.valores_cargados_roles)
  }
}
