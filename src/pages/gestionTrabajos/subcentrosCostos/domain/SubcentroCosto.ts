import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class SubcentroCosto extends EntidadAuditable {
    nombre: string | null
    centro_costo: null | number
    activo: boolean

    constructor() {
        super()
        this.nombre = null
        this.centro_costo = null
        this.activo = true
    }
}