import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ItemPreingresoMaterial extends EntidadAuditable {
    preingreso: number | null
    producto: number | null //producto padre del detalle
    descripcion: number | null //el detalle_id
    // detalle: number | null //el detalle_id
    cantidad: number | null
    unidad_medida: number | null //producto padre del detalle
    serial: number | null //descripcion del detalle
    codigo_bobina: number | null
    punta_inicial: number | null
    punta_final: number | null
    fotografia: string | null
    condicion: string | null

    constructor() {
        super()
        this.preingreso = null
        this.cantidad = null
        this.descripcion = null
        // this.detalle = null
        this.producto = null
        this.unidad_medida = null
        this.serial = null
        this.codigo_bobina = null
        this.punta_final = null
        this.punta_inicial = null
        this.fotografia = null
        this.condicion = null

    }
}