import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { SeguroVehicular } from "../domain/SeguroVehicular";
import { endpoints } from "config/api";

export class SeguroVehicularController extends TransaccionSimpleController<SeguroVehicular>{
    constructor(){
        super(endpoints.seguros)
    }
}