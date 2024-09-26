import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { PrestamoQuirorafario } from '../domain/PrestamoQuirorafario';
import { endpoints } from 'config/api';

export class PrestamoQuirorafarioController extends TransaccionSimpleController<PrestamoQuirorafario>{
  constructor(){
    super(endpoints.prestamos_quirografarios)
  }
}

