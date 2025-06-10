import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { TipoPuestoTrabajo } from '../domain/TipoPuestoTrabajo';
import { endpoints } from 'config/api';

export class TipoPuestoTrabajoController extends TransaccionSimpleController<TipoPuestoTrabajo>{
  constructor(){
    super(endpoints.tipos_puestos)
  }
}

