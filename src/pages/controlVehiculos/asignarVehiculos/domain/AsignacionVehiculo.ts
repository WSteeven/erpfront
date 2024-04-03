import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class AsignacionVehiculo extends EntidadAuditable {
    vehiculo: string | null
    entrega: number | null
    responsable: number | null
    observacion_recibe: string | null
    observacion_entrega: string | null
    fecha_entrega: string | null
    estado: string | null
    canton: number | null
    accesorios: string | null
    estado_carroceria: string | null
    estado_mecanico: string | null
    estado_electrico: string | null

    constructor() {
        super()
        this.vehiculo = null
        this.entrega = null
        this.responsable = null
        this.observacion_entrega = null
        this.observacion_recibe = null
        this.fecha_entrega = null
        this.estado = null
        this.canton = null
        this.accesorios = null
        this.estado_carroceria = null
        this.estado_mecanico = null
        this.estado_electrico = null
    }
}