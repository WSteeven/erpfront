import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Parroquia } from '../domain/Parroquia';
import { endpoints } from 'config/api';

export class ParroquiaController extends TransaccionSimpleController<Parroquia> {
    constructor() {
        super(endpoints.parroquias);
    }
}