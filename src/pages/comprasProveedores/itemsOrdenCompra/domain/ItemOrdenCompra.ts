import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class ItemOrdenCompra extends EntidadAuditable {
    cantidad: number | null
    descripcion: number | null //descripcion del detalle
    detalle: number | null //el detalle_id
    facturable: boolean
    grava_iva: boolean
    iva: number | null
    orden_compra: number | null
    porcentaje_descuento: number | null
    descuento: number | null
    precio_unitario: number | null
    producto: number | null //producto padre del detalle
    subtotal: number | null
    total: number | null
    unidad_medida: number | null //producto padre del detalle

    constructor() {
        super()
        this.cantidad = null
        this.descripcion = null
        this.detalle = null
        this.facturable = true
        this.grava_iva = true
        this.iva = null
        this.orden_compra = null
        this.porcentaje_descuento = null
        this.descuento = null
        this.precio_unitario = null
        this.producto = null
        this.subtotal = null
        this.total = null
        this.unidad_medida = null
    }
}