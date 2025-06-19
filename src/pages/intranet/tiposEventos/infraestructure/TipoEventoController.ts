import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { TipoEvento } from '../domain/TipoEvento';
import { endpoints } from 'config/api';

export class TipoEventoController extends TransaccionSimpleController<TipoEvento>{
  constructor(){
    super(endpoints.tipos_eventos)
  }
}
