import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class TransferenciaVehiculo extends EntidadAuditable {
    vehiculo: number | null
    entrega: number | null
    canton: number | null
    responsable: number | null
    observacion_recibe: string | null
    observacion_entrega: string | null
    fecha_entrega: string | null
    estado: string | null
    accesorios: string | null
    estado_carroceria: string | null
    estado_mecanico: string | null
    estado_electrico: string | null
    fecha_aceptacion: string | null
    devuelve: number | null
    asignacion: number | null
    transferencia: number | null

    constructor() {
        super()
        this.vehiculo = null
        this.entrega = null
        this.responsable = null
        this.observacion_recibe = null
        this.observacion_entrega = null
        this.estado = null
        this.fecha_entrega = null
        this.fecha_aceptacion = null
        this.canton = null
        this.accesorios = null
        this.estado_carroceria = null
        this.estado_mecanico = null
        this.estado_electrico = null
        this.devuelve = null
        this.asignacion = null
        this.transferencia = null
    }
}