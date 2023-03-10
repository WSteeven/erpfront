import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

// Sólo se usa POST
export class DesignarSecretarioGrupoController extends TransaccionSimpleController<any> {
    constructor() {
        super(endpoints.designar_secretario_grupo)
    }
}