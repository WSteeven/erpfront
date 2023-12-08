import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { ConfiguracionGeneral } from "../domain/Configuracion";
import { endpoints } from "config/api";

export class ConfiguracionGeneralController extends TransaccionSimpleController<ConfiguracionGeneral>{
    constructor(){
        super(endpoints.configuracion)
    }
}