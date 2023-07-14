import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { PrestamoHipotecario } from '../domain/PrestamoHipotecario';
import { endpoints } from 'config/api';

export class PrestamoHipotecarioController extends TransaccionSimpleController<PrestamoHipotecario>{
  constructor(){
    super(endpoints.prestamo_hipotecario)
  }
}

