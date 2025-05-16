import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { DescuentosLey } from '../domain/DescuentosLey';
import { endpoints } from 'config/api';

export class DescuentosLeyController extends TransaccionSimpleController<DescuentosLey>{
  constructor(){
    super(endpoints.descuentos_ley)
  }
}

