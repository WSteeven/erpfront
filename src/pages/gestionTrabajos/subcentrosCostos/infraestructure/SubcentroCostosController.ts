import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { SubcentroCosto } from '../domain/SubcentroCosto';
import { endpoints } from 'config/api';

export class SubcentroCostoController extends TransaccionSimpleController<SubcentroCosto> {
    constructor() {
        super(endpoints.subcentros_costos)
    }
}