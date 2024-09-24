import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Postulacion } from '../domain/Postulacion';
import { endpoints } from 'config/api'


export class PostulacionController extends TransaccionSimpleController<Postulacion>{
  constructor(){
    super(endpoints.postulacion_vacante);
  }
}
