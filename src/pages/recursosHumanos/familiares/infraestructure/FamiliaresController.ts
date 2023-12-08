import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Familiares } from '../domain/Familiares';
import { endpoints } from 'config/api';

export class FamiliaresController extends TransaccionSimpleController<Familiares>{
  constructor(){
    super(endpoints.familiares)
  }
}

