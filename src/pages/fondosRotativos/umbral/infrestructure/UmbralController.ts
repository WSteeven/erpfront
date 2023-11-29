import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Umbral } from "../domain/Umbral";
import { endpoints } from "config/api";

export class UmbralController extends TransaccionSimpleController<Umbral>{
  constructor() {
    super(endpoints.umbral)
  }
}
