import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Inventario } from "../domain/Inventario";
import { endpoints } from "config/api";

export class InventarioController extends TransaccionSimpleController<Inventario>{
    constructor(){
        super(endpoints.inventarios)
    }
}