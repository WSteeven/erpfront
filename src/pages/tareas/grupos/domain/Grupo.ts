import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class Grupo extends EntidadAuditable {
    nombre: string | null
    empleado_id: number | null
    estado: boolean

    constructor() {
        super()
        this.nombre = null
        this.empleado_id = null // responsable
        this.estado = false
    }
}