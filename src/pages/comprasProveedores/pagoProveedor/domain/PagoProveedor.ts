import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PagoProveedor extends EntidadAuditable {
    archivo: string | null
    nombre: string | null
    realizador: string | null
    estado: string | null
    cant_elementos: number | null
    listado: []

    constructor() {
        super()
        this.archivo = null
        this.nombre = null
        this.realizador = null
        this.estado = null
        this.cant_elementos = null
        this.listado = []
    }
}