import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Historial } from '../domain/HistorialVehiculo';
import { endpoints } from 'config/api';

export class HistorialVehiculoController extends TransaccionSimpleController<Historial> {
    constructor() {
        super(endpoints.historial_vehiculos)
    }
}