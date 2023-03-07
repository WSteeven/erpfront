import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Usuario } from "../domain/Usuario";
import { endpoints } from "config/api";

export class UsuarioController extends TransaccionSimpleController<Usuario>{
  constructor() {
    super(endpoints.lista_usuarios)
  }
}
