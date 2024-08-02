import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Evento } from "../domain/Evento";
import { endpoints } from "config/api";

export class EventoController extends TransaccionSimpleController<Evento> {
  constructor() {
    super(endpoints.eventos)
  }
}
