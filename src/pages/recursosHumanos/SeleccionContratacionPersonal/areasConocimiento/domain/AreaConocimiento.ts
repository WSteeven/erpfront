import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class AreaConocimiento extends EntidadAuditable {
    cargo: number | null
    nombre: string | null
    activo: boolean

    constructor() {
        super()
        this.cargo = null
        this.nombre = null
        this.activo = true
    }
}
