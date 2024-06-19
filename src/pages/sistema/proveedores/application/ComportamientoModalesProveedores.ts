import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { ProveedorModales } from '../domain/ProveedorModales';

export class ComportamientoModalesProveedores extends ComportamientoModales<ProveedorModales> {
  constructor() {
    super(new ProveedorModales())
  }
}
