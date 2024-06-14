import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Actividad extends EntidadAuditable {
    fecha_hora: string | null
    actividad: string | null
    observacion: string | null
    fotografia: string | null
    empleado: number | null

    constructor() {
        super()
        this.fecha_hora = null
        this.actividad = null
        this.observacion = null
        this.fotografia = null
        this.empleado = null
    }
}