import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {PlantillaBase} from 'sistema/plantillasBase/domain/PlantillaBase';
import {endpoints} from 'config/api';

export class PlantillaBaseController extends TransaccionSimpleController<PlantillaBase>{
    constructor() {
        super(endpoints.plantillas_base);

    }

}