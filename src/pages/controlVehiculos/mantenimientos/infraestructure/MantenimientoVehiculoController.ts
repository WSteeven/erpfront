import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { MantenimientoVehiculo } from "../domain/MantenimientoVehiculo";
import { endpoints } from "config/api";

export class MantenimientoVehiculoController extends TransaccionSimpleController<MantenimientoVehiculo>{
    constructor(){
        super(endpoints.mantenimientos_vehiculos)
    }
}