import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { PerfilModales } from 'pages/perfil/domain/PerfilModales'


export class ComportamientoModalesPerfil extends ComportamientoModales<PerfilModales> {
  constructor() {
    super(new PerfilModales())
  }
}
