import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { TipoFibra } from "../domain/TipoFibra";
import { endpoints } from "config/api";

export class TipoFibraController extends TransaccionSimpleController<TipoFibra>{
    constructor(){
        super(endpoints.tipos_fibras)
    }
}