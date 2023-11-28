import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { CategoriaOferta } from "../domain/CategoriaOferta";
import { endpoints } from "config/api";

export class CategoriaOfertaController extends TransaccionSimpleController<CategoriaOferta>{
    constructor(){
        super(endpoints.categorias_ofertas)
    }
}