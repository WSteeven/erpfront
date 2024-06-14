import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class Tanqueo extends EntidadAuditable {
    vehiculo: string | null
    solicitante: string | null
    solicitante_id:number | null
    fecha_hora: string | null
    km_tanqueo: string | null
    monto:number | null
    imagen_comprobante: string | null
    imagen_tablero: string | null

    constructor() {
        super()
        this.vehiculo = null
        this.solicitante = null
        this.solicitante_id = null
        this.fecha_hora = null
        this.km_tanqueo = null
        this.monto = null
        this.imagen_comprobante = null
        this.imagen_tablero = null

    }
}
