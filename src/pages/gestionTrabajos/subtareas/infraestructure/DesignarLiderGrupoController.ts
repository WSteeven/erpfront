import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

// Sólo se usa POST
export class DesignarLiderGrupoController extends TransaccionSimpleController<any> {
    constructor() {
        super(endpoints.designar_lider_grupo)
    }
}