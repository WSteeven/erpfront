import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Proveedor } from '../domain/Proveedor';
import { endpoints } from 'config/api';

export class ProveedorController extends TransaccionSimpleController<Proveedor> {
  constructor() {
    super(endpoints.proveedores)
  }
}
