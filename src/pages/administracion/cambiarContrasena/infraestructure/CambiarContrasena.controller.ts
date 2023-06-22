import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { CambiarContrasena } from '../domain/CambiarContrasena.domain'

export class CambiarContrasenaController extends TransaccionSimpleController<CambiarContrasena>

{
  constructor() {
    super(endpoints.cambiarContrasena)
  }
}
