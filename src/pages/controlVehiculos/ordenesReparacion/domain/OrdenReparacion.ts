import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class OrdenReparacion extends EntidadAuditable {
    solicitante: string | null
    solicitante_id: number | null
    vehiculo: string | null
    fecha: string | null
    autorizacion: string | null
    servicios: string | null
    listadoReparaciones: any[]

    constructor() {
        super()
        this.solicitante = null
        this.solicitante_id = null
        this.vehiculo = null
        this.fecha = null
        this.autorizacion = null
        this.servicios = null
        this.listadoReparaciones = []
    }

}