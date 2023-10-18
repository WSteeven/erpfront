import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ItemPreingresoMaterial extends EntidadAuditable {
    producto: number | null //producto padre del detalle
    detalle: number | null //el detalle_id
    cantidad: number | null
    unidad_medida: number | null //producto padre del detalle
    serie: number | null //descripcion del detalle
    codigo_bobina: number|null
    punta_inicial: number|null
    punta_final: number | null
    
    constructor() {
        super()
        this.cantidad = null
        this.detalle = null
        this.producto = null
        this.unidad_medida = null
        this.serie = null
        this.codigo_bobina =null
        this.punta_final= null
        this.punta_inicial= null
        
    }
}