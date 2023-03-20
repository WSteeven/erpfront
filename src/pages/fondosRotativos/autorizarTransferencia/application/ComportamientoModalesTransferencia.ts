import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { AutorizarTransferenciaModales } from '../domain/AutorizarTransferenciaModales'

export class ComportamientoModalesTransferencia extends ComportamientoModales<AutorizarTransferenciaModales> {
  constructor() {
    super(new AutorizarTransferenciaModales())
  }
}
