import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { BitacoraVehicular } from '../domain/BitacoraVehicular';
import { endpoints } from 'config/api';

export class BitacoraVehicularController extends TransaccionSimpleController<BitacoraVehicular> {
    constructor() {
        super(endpoints.bitacoras_vehiculos)
    }
}