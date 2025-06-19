import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { ProveedorInternacional } from '../domain/ProveedorInternacional';
import { endpoints } from 'config/api';

export class ProveedorInternacionalController extends TransaccionSimpleController<ProveedorInternacional>{
  constructor(){
    super(endpoints.proveedores_internacionales);
  }
}
