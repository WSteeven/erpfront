import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ControlStock extends EntidadAuditable {
    producto: number | null
    sucursal_id: number | null
    detalle_id: number | null
    cliente_id: number | null
    minimo: string | null
    reorden: string | null
    actual: string | null
    estado: string | null

    constructor() {
        super()
        this.producto = null
        this.sucursal_id = null
        this.detalle_id = null
        this.cliente_id = null
        this.minimo = null
        this.reorden = null
        this.actual = null
        this.estado = null
    }
}