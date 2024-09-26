import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Usuario } from '../domain/Usuario';
import { endpoints } from 'config/api';

export class UsuarioAutorizadoresController extends TransaccionSimpleController<Usuario> {
  constructor() {
    super(endpoints.usuarios_autorizadores)
  }
}
