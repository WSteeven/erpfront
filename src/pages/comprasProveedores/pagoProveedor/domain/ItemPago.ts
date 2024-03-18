import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ItemPago extends EntidadAuditable {
    pago_proveedor_id: string | null
    proveedor: string | null
    razon_social: string | null
    tipo_documento: string | null
    num_documento: string | null
    fecha_emision: string | null
    fecha_vencimiento: string | null
    centro_costo: string | null
    plazo: string | null
    total: string | null
    descripcion: string | null
    valor_documento: string | null
    retenciones: string | null
    pagos: string | null
    valor_pagar: string | null

    constructor() {
        super()
        this.pago_proveedor_id = null
        this.proveedor = null
        this.razon_social = null
        this.tipo_documento = null
        this.num_documento = null
        this.fecha_emision = null
        this.fecha_vencimiento = null
        this.centro_costo = null
        this.plazo = null
        this.total = null
        this.descripcion = null
        this.valor_documento = null
        this.retenciones = null
        this.pagos = null
        this.valor_pagar = null
    }
}