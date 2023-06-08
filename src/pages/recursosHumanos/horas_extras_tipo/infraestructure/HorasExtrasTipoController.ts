import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { HorasExtrasTipo } from "../domain/HorasExtrasTipo";
import { endpoints } from "config/api";

export class HorasExtrasTipoController extends TransaccionSimpleController<HorasExtrasTipo>{
  constructor(){
    super(endpoints.horas_extras_tipo)
  }
}

