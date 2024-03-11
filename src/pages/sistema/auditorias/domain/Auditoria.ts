import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Auditoria extends EntidadAuditable {
    empleado: string | null
    fecha_inicio: string | null
    fecha_fin: string | null

    constructor() {
        super()
        this.empleado = null
        this.fecha_inicio = null
        this.fecha_fin = null
    }
}