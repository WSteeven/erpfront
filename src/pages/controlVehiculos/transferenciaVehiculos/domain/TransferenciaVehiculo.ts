import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class TransferenciaVehiculo extends EntidadAuditable {
    vehiculo: number | null
    entrega: number | null
    responsable: number | null
    observacion: string | null
    estado: number | null
    fecha_entrega: string | null
    fecha_aceptacion: string | null
    canton: string | null
    accesorios: string | null
    estado_carroceria: string | null
    estado_mecanico: string | null
    estado_electrico: string | null

    constructor() {
        super()
        this.vehiculo = null
        this.entrega = null
        this.responsable = null
        this.observacion = null
        this.estado = null
        this.fecha_entrega = null
        this.fecha_aceptacion = null
        this.canton = null
        this.accesorios = null
        this.estado_carroceria = null
        this.estado_mecanico = null
        this.estado_electrico = null
    }
}