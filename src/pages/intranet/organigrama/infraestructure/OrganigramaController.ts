import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Organigrama } from '../domain/Organigrama'; // Asegúrate de que esta ruta sea correcta
import { endpoints } from 'config/api';

export class OrganigramaController extends TransaccionSimpleController<Organigrama> {
  constructor() {
    super(endpoints.organigrama);
  }
}
