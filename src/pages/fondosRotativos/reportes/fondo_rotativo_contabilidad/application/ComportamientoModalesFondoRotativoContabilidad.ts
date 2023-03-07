import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { FondoRotativoContabilidadModales } from '../domain/FondoRotativoContabilidadModales'

export class ComportamientoModalesFondoRotativoContabilidad extends ComportamientoModales<FondoRotativoContabilidadModales> {
  constructor() {
    super(new FondoRotativoContabilidadModales())
  }
}
