import { endpoints } from "config/api";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { CentroCosto } from "../domain/CentroCostos";

export class CentroCostoController extends TransaccionSimpleController<CentroCosto>{
    constructor(){
        super(endpoints.centros_costos)
    }
}