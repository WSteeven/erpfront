import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Matricula extends EntidadAuditable {
    vehiculo: string | null
    placa: string
    fecha_matricula: string | null
    proxima_matricula: string | null
    matriculador: string | null
    matriculado: boolean
    observacion: string | null
    monto: string | null
    estado: boolean

    constructor() {
        super()
        this.vehiculo = null
        this.placa = ''
        this.fecha_matricula = null
        this.proxima_matricula = null
        this.matriculador = null
        this.matriculado = true
        this.estado = this.matriculado
        this.observacion = null
        this.monto = null
    }
}
