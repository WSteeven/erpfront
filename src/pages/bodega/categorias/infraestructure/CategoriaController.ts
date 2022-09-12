import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Categoria } from "../domain/Categoria";
import { endpoints } from "config/api";

export class CategoriaController extends TransaccionSimpleController<Categoria>{
    constructor(){
        super(endpoints.categorias)
    }
}