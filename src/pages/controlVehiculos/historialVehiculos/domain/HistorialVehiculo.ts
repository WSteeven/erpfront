import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { Ref, ref } from "vue";

export class HistorialVehiculo extends EntidadAuditable {
    vehiculo: string | null
    fecha_inicio: string | null
    fecha_fin: string | null
    accion: string | null
    opciones: Ref

    constructor() {
        super()
        this.vehiculo = null
        this.accion = null
        this.fecha_inicio = null
        this.fecha_fin = null
        this.opciones = ref(['TODOS'])
    }
}