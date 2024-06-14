import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ChecklistImagenVehiculo extends EntidadAuditable {
    //partes del vehiculo
    bitacora_id: number | null
    imagen_frontal: string | null
    imagen_trasera: string | null
    imagen_lateral_derecha: string | null
    imagen_lateral_izquierda: string | null
    imagen_tablero_km: string | null
    imagen_tablero_radio: string | null
    imagen_asientos: string | null
    imagen_accesorios: string | null
    observacion: string | null



    constructor(id: number | null = null) {
        super()
        this.bitacora_id = id
        this.imagen_frontal = null
        this.imagen_trasera = null
        this.imagen_lateral_derecha = null
        this.imagen_lateral_izquierda = null
        this.imagen_tablero_km = null
        this.imagen_tablero_radio = null
        this.imagen_asientos = null
        this.imagen_accesorios = null
        this.observacion = null
    }
}