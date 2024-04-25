import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { Ref, ref } from "vue";

export class HistorialVehiculo extends EntidadAuditable {
    vehiculo: string | null
    accion: string | null
    opciones: Ref

    constructor() {
        super()
        this.vehiculo = null
        this.accion = null
        // this.opciones = ref(['MANTENIMIENTOS','INCIDENTES','TODOS'])
        this.opciones = ref(['op1'])
    }
}