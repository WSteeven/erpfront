import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Archivo } from '../domain/Archivo';
import { endpoints } from 'config/api';

export class ArchivoController extends TransaccionSimpleController<Archivo> {
    constructor() {
        super(endpoints.archivos)
    }
}