import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {OficinaBiometrico} from 'controlPersonal/oficinaBiometrico/domain/OficinaBiometrico';
import {endpoints} from 'config/api';

export class OficinaBiometricoController extends TransaccionSimpleController<OficinaBiometrico>{
    constructor() {
        super(endpoints.oficinas_biometricos);
    }
}