import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Noticia } from '../domain/Noticia';
import { endpoints } from 'config/api';

export class NoticiaController extends TransaccionSimpleController<Noticia>{
  constructor(){
    super(endpoints.noticias)
  }
}
