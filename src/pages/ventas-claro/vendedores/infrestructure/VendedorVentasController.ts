import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Vendedor } from "../domain/Vendedor";
import { endpoints } from "config/api";

export class VendedorVentasController extends TransaccionSimpleController<Vendedor>{
    constructor(){
        super(endpoints.vendedores_ventas_claro)
    }
}