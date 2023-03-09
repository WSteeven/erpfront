import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { endpoints } from 'config/api'

// Sólo se usa POST
export class DesignarSecretarioGrupoController extends TransaccionSimpleController<EntidadAuditable> {
    constructor() {
        super(endpoints.designar_secretario_grupo)
    }
}