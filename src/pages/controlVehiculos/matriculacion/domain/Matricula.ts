import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Matricula extends EntidadAuditable {
    vehiculo: string | null
    fecha_matricula: string | null
    proxima_matricula: string | null
    matriculador: string | null
    estado: boolean

    constructor() {
        super()
        this.vehiculo = null
        this.fecha_matricula = null
        this.proxima_matricula = null
        this.matriculador = null
        this.estado =true
    }

}