import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { EgresoRolPago } from '../domain/EgresoRolPago';

export class EgresoRolPagoController extends TransaccionSimpleController<EgresoRolPago>{
  constructor(){
    super(endpoints.egreso_rol_pago)
  }
}

