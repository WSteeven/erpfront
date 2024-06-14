import { Validador } from "shared/validadores/domain/Validador";
import { Empleado } from "../domain/Empleado";
import { Conductor } from "pages/controlVehiculos/conductores/domain/Conductor";
import { rolesSistema } from "config/utils";

export class ValidarChofer implements Validador {
    private empleado: Empleado
    private conductor: Conductor

    constructor(empleado: Empleado, conductor: Conductor) {
        this.empleado = empleado
        this.conductor = conductor
    }

    async validar(): Promise<boolean> {
        //primero verificamos si el empleado tiene el rol de chofer
        if (this.empleado.roles.includes(rolesSistema.chofer)) {
            if (this.conductor.puntos == null) throw new Error('Por favor llena todos los campos de información de licencia')
            else if (this.conductor.puntos < 20) throw new Error('El Chofer no puede ser contratado porque no cumple con el mínimo de puntos establecidos en el reglamento interno')
            else return true
        }
        return true
    }
}