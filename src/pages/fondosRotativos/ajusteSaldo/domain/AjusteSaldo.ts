import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class AjusteSaldo extends EntidadAuditable {
    solicitante: string | number | null
    destinatario: string | number | null
    autorizador: string | number | null
    motivo: string | null
    descripcion: string | null
    monto: number | null
    tipo: string | null

    constructor() {
        super()
        this.solicitante = null
        this.destinatario = null
        this.autorizador = null
        this.motivo = null
        this.descripcion = null
        this.monto = null
        this.tipo = null
    }
}