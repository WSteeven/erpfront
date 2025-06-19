import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { VacanteDisponibleModales } from '../domain/VacanteDisponibleModales';

export class ComportamientoModalesVacanteDisponible extends ComportamientoModales<VacanteDisponibleModales> {
  constructor() {
    super(new VacanteDisponibleModales());
  }
}
