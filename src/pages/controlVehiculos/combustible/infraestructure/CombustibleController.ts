import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Combustible } from '../domain/Combustible';
import { endpoints } from 'config/api';

export class CombustibleController extends TransaccionSimpleController<Combustible> {
    constructor() {
        super(endpoints.combustibles)
    }
}