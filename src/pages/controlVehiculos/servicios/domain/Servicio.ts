import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Servicio extends EntidadAuditable {
    nombre: string | null
    tipo: string | null
    intervalo: string | null
    estado: boolean

    constructor() {
        super()
        this.nombre = null
        this.tipo = null
        this.intervalo = null
        this.estado = true
    }

}