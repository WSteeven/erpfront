import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ControlMaterialSubtarea extends EntidadAuditable {
    detalle_producto: number | null
    cantidad_inicial: number | null
    cantidad_usada: number | null
    cantidad_devuelta: number | null

    constructor() {
        super()
        this.detalle_producto = null
        this.cantidad_inicial = null
        this.cantidad_usada = null
        this.cantidad_devuelta = null
    }
}