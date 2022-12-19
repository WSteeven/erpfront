import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class Archivo extends EntidadAuditable {
    nombre: string | null
    tamanio_bytes: string | null
    comentario: string | null
    ruta: string | null

    constructor() {
        super()
        this.nombre = null
        this.tamanio_bytes = null
        this.comentario = null
        this.ruta = null
    }
}