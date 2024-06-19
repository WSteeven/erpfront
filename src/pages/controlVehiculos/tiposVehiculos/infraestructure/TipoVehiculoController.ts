import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { TipoVehiculo } from '../domain/TipoVehiculo';
import { endpoints } from 'config/api';

export class TipoVehiculoController extends TransaccionSimpleController<TipoVehiculo> {
    constructor() {
        super(endpoints.tipos_vehiculos)
    }
}