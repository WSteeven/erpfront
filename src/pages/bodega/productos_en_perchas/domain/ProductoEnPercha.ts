import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ProductoEnPercha extends EntidadAuditable {
    stock: number | null
    ubicacion: number | null
    inventario: number | null

    constructor() {
        super()
        this.stock = null
        this.ubicacion = null
        this.inventario = null
    }
}