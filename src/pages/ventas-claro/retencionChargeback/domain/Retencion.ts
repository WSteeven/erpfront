import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Retencion extends EntidadAuditable {
    venta: number | null
    venta_info: string | null
    vendedor: number | null
    vendedor_info: string | null
    fecha_retencion: string | null
    valor_retenido: string | null
    pagado: boolean
    constructor() {
        super()
        this.venta = null
        this.venta_info = null
        this.vendedor = null
        this.vendedor_info = null
        this.fecha_retencion = null
        this.valor_retenido = null
        this.pagado = false
    }
}