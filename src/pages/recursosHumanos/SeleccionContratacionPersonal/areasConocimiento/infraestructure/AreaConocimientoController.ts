import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { AreaConocimiento } from '../domain/AreaConocimiento';
import { endpoints } from 'config/api';

export class AreaConocimientoController extends TransaccionSimpleController<AreaConocimiento>{
    constructor(){
        super(endpoints.areas_conocimientos)
    }
}