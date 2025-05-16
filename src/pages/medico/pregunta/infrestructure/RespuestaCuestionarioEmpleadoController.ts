import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Pregunta } from '../domain/Pregunta';
import { endpoints } from 'config/api';

export class PreguntaController extends TransaccionSimpleController<Pregunta> {
  constructor() {
    super(endpoints.preguntas)
  }
}
