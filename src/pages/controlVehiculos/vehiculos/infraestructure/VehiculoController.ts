import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Vehiculo } from "../domain/Vehiculo";
import { endpoints } from "config/api";

export class VehiculoController extends TransaccionSimpleController<Vehiculo>{
    constructor(){
        super(endpoints.vehiculos)
    }
}