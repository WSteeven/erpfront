import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Archivo } from '../domain/Archivo'

export class ArchivoSubtareaController extends TransaccionSimpleController<Archivo> {
    constructor() {
        super(endpoints.archivos_subtareas)
    }
}
