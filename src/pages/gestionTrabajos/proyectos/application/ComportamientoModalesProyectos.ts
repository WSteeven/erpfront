import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { ProyectoModales } from '../domain/ProyectoModales';

export class ComportamientoModalesProyectos extends ComportamientoModales<ProyectoModales> {
  constructor() {
    super(new ProyectoModales())
  }
}
