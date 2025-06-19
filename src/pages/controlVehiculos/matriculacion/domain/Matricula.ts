import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Matricula extends EntidadAuditable {
    vehiculo: string | null
    placa: string
    fecha_matricula: string | null
    proxima_matricula: string | null
    valor_estimado_pagar: string | null
    matriculador: string | null
    matriculado: boolean
    fecha_pago: string | null
    observacion: string | null
    monto: string | null
    estado: boolean

    constructor() {
        super()
        this.vehiculo = null
        this.placa = ''
        this.fecha_matricula = null
        this.proxima_matricula = null
        this.valor_estimado_pagar = null
        this.matriculador = null
        this.matriculado = true
        this.fecha_pago = null
        this.estado = this.matriculado
        this.observacion = null
        this.monto = null
    }
}
