import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Motivo extends EntidadAuditable {
    nombre: string | null
    tipo_transaccion: string | null
    tipo_transaccion_id: string | null
    tipo_seleccionado: string | null

    constructor() {
        super()
        this.nombre = null
        this.tipo_transaccion = null
        this.tipo_transaccion_id = null
        this.tipo_seleccionado = null
    }
}