import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { GestionPacienteModales } from "../domain/GestionPacienteModales";

export class ComportamientoModalesGestionPaciente extends ComportamientoModales<GestionPacienteModales>{
  constructor() {
    super(new GestionPacienteModales())
  }
}
