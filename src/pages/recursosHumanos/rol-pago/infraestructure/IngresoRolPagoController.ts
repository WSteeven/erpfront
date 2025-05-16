import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { endpoints } from 'config/api';
import { IngresoRolPago } from '../domain/IngresoRolPago';

export class IngresoRolPagoController extends TransaccionSimpleController<IngresoRolPago>{
  constructor(){
    super(endpoints.ingreso_rol_pago)
  }
}

