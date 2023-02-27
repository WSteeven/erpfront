import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController"; 
import { Empresa} from "../domain/Empresa";
import { endpoints } from "config/api";

export class EmpresaController extends TransaccionSimpleController<Empresa>{
    constructor(){
        super(endpoints.empresas)
    }
}
