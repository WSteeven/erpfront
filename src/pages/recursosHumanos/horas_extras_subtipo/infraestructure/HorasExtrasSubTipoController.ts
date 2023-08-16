import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { HorasExtrasSubTipo } from "../domain/HorasExtrasSubTipo";
import { endpoints } from "config/api";

export class HorasExtrasSubTipoController extends TransaccionSimpleController<HorasExtrasSubTipo>{
  constructor(){
    super(endpoints.horas_extras_subtipo)
  }
}

