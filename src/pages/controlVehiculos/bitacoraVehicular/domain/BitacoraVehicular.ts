import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class BitacoraVehicular extends EntidadAuditable {
    fecha: string | null
    hora_salida: string | null
    hora_llegada: string | null
    km_inicial: string | null
    km_final: string | null
    tanque_inicio: string | null
    tanque_final: string | null
    firmada: string | null
    chofer: string | null
    vehiculo: string | null

    constructor() {
        super()
        this.fecha = null
        this.hora_salida = null
        this.hora_llegada = null
        this.km_inicial = null
        this.km_final = null
        this.tanque_inicio = null
        this.tanque_final = null
        this.firmada = null
        this.chofer = null
        this.vehiculo = null
    }
}