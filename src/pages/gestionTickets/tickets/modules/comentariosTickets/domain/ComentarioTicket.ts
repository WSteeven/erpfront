import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ComentarioTicket extends EntidadAuditable {
    comentario: string | null
    empleado: number | null
    ticket: number | null

    constructor() {
        super()
        this.comentario = null
        this.empleado = null
        this.ticket = null
    }
}