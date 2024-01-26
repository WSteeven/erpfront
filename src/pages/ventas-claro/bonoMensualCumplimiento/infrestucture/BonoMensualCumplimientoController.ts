import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { BonoMensualCumplimiento } from "../domain/BonoMensualCumplimiento";
import { endpoints } from "config/api";

export class BonoMensualCumplimientoController extends TransaccionSimpleController<BonoMensualCumplimiento>{
  constructor(){
    super(endpoints.bono_mensual_cumplimiento)
  }
}

