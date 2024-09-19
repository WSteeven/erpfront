import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Examen } from "../domain/Examen";
import { endpoints } from "config/api";

export class ExamenController extends TransaccionSimpleController<Examen>{
  constructor() {
    super(endpoints.examenes_postulantes);
  }
}
