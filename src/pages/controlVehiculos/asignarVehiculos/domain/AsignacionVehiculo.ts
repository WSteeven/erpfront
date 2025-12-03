import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class AsignacionVehiculo extends EntidadAuditable {
    vehiculo: string | null
    vehiculo_id: number | null
    entrega: number | null
    entrega_id: number | null
    responsable: number | null
    responsable_id: number | null
    observacion_recibe: string | null
    observacion_entrega: string | null
    fecha_entrega: string | null
    estado: string | null
    garaje: string | null
    latitud: string | null
    longitud: string | null
    canton: number | null
    canton_id: number | null
    accesorios: string | null
    estado_carroceria: string | null
    estado_mecanico: string | null
    estado_electrico: string | null

    constructor() {
        super()
        this.vehiculo = null
        this.vehiculo_id = null
        this.entrega = null
        this.entrega_id = null
        this.responsable = null
        this.responsable_id = null
        this.observacion_entrega = null
        this.observacion_recibe = null
        this.fecha_entrega = null
        this.estado = null
        this.garaje = null
        this.latitud = null
        this.longitud = null
        this.canton = null
        this.canton_id = null
        this.accesorios = null
        this.estado_carroceria = null
        this.estado_mecanico = null
        this.estado_electrico = null
    }
}