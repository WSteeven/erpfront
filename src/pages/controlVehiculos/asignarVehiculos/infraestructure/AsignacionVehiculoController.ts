import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { AsignacionVehiculo } from '../domain/AsignacionVehiculo';

export class AsignacionVehiculoController extends TransaccionSimpleController<AsignacionVehiculo> {
    constructor() {
        super(endpoints.asignaciones_vehiculos)
    }
}