import { TransaccionSimpleController } from 'src/shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { AreaConocimiento } from '../domain/AreaConocimiento';
import { endpoints } from 'src/config/api';

export class AreaConocimientoController extends TransaccionSimpleController<AreaConocimiento>{
    constructor(){
        super(endpoints.areas_conocimientos)
    }
}
