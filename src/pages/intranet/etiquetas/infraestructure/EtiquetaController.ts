import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Etiqueta } from '../domain/Etiqueta';
import { endpoints } from 'config/api';

export class EtiquetaController extends TransaccionSimpleController<Etiqueta>{
  constructor(){
    super(endpoints.etiquetas)
  }
}
