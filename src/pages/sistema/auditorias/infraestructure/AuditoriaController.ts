import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Auditoria } from '../domain/Auditoria';
import { endpoints } from 'config/api';

export class AuditoriaController extends TransaccionSimpleController<Auditoria> {
    constructor() {
        super(endpoints.auditorias)
    }
}