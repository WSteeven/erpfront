import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";
import { TipoDiscapacidad } from "../domain/TipoDiscapacidad";

export class TipoDiscapacidadController extends TransaccionSimpleController<TipoDiscapacidad>{
  constructor(){
    super(endpoints.tipos_discapacidades)
  }
}
