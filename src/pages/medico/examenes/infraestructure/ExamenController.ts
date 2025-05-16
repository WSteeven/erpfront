import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { Examen } from '../domain/Examen'

export class ExamenController extends TransaccionSimpleController<Examen> {
  constructor() {
    super(endpoints.examenes)
  }
}

