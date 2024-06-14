import { endpoints } from "config/api";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TransferenciaVehiculo } from "../domain/TransferenciaVehiculo";

export class TransferenciaVehiculoController extends TransaccionSimpleController<TransferenciaVehiculo>{
    constructor(){
        super(endpoints.transferencias_vehiculos)
    }
}