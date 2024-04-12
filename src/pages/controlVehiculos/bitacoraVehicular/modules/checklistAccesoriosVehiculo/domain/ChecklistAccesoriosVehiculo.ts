import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ChecklistAccesoriosVehiculo extends EntidadAuditable {
    //partes del vehiculo
    bitacora_id: number| null
    botiquin: string | null
    extintor: string | null
    caja_herramientas: string | null
    triangulos: string | null
    llanta_emergencia: string | null
    cinturones: string | null
    gata: string | null
    portaescalera: string | null
    observacion_accesorios_vehiculo: string | null

    constructor() {
        super()
        this.bitacora_id = null
        this.botiquin = 'LLENO'
        this.extintor = 'LLENO'
        this.caja_herramientas = 'LLENO'
        this.triangulos = 'BUENO'
        this.llanta_emergencia = 'BUENO'
        this.cinturones = 'BUENO'
        this.gata = 'BUENO'
        this.portaescalera = 'BUENO'
        this.observacion_accesorios_vehiculo = null
    }
}