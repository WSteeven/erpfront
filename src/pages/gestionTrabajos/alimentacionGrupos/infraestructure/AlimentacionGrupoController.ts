import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { AlimentacionGrupo } from '../domain/AlimentacionGrupo'
import { endpoints } from 'config/api'

export class AlimentacionGrupoController extends TransaccionSimpleController<AlimentacionGrupo> {
    constructor() {
        super(endpoints.alimentacion_grupos)
    }
}
