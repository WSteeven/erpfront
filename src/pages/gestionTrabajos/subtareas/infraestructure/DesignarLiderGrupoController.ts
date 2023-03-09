import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { endpoints } from 'config/api'

// Sólo se usa POST
export class DesignarLiderGrupoController extends TransaccionSimpleController<Empleado> {
    constructor() {
        super(endpoints.designar_lider_grupo)
    }
}