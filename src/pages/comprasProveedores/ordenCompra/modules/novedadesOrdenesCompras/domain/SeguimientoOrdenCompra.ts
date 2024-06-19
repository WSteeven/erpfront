import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export default class NovedadOrdenCompra extends EntidadAuditable {
    fecha_hora: string | null
    actividad: string | null
    observacion: string | null
    fotografia: string | null
    orden_compra: string | null

    constructor() {
        super()
        this.fecha_hora = null
        this.actividad = null
        this.observacion = null
        this.fotografia = null
        this.orden_compra = null
    }
}