import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { PostulacionModales } from "../domain/PostulacionModales";

export class ComportamientoModalesPostulacion extends ComportamientoModales<PostulacionModales>{
  constructor(){
    super(new PostulacionModales())
  }
}
