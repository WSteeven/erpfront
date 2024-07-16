import { TransaccionSimpleController } from 'src/shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Vacante } from '../domain/Vacante';
import { endpoints } from 'src/config/api';

export class VacanteController extends TransaccionSimpleController<Vacante>{
    constructor(){
        super(endpoints.vacantes)
    }
}
