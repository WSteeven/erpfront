import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ProductoSeleccionadoSolicitudDescuento extends EntidadAuditable {
    producto: string | null
    descripcion: string | null
    cantidad: string | null
    precio_unitario: string | null
    acciones?: string | null

    constructor() {
        super()
        this.producto = null
        this.descripcion = null
        this.cantidad = null
        this.precio_unitario = null
    }
}