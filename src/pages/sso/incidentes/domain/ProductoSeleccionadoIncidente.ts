import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ProductoSeleccionadoIncidente extends EntidadAuditable {
    producto: string | null
    descripcion: string | null
    cantidad: string | null
    motivo_cambio: string | null
    acciones?: string | null

    constructor() {
        super()
        this.producto = null
        this.descripcion = null
        this.cantidad = null
        this.motivo_cambio = null
    }
}