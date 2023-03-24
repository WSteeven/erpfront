import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { MainLayoutModales } from '../domain/MainlayoutModales'

export class ComportamientoModalesMainLayout extends ComportamientoModales<MainLayoutModales> {
  constructor() {
    super(new MainLayoutModales())
  }
}
