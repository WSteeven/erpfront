import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { PermisoModales } from '../domain/PermisoModales'


export class ComportamientoModalesPermisoNuevo extends ComportamientoModales<PermisoModales> {
  constructor() {
    super(new PermisoModales())
  }
}
