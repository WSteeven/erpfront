import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class BitacoraVehicular extends EntidadAuditable {
    fecha: string | null
    hora_salida: string | null
    hora_llegada: string | null
    km_inicial: string | null
    km_final: string | null
    tanque_inicio: number | null
    tanque_final: number | null
    firmada: boolean | null
    chofer: string | null
    chofer_id: number | null
    vehiculo: string | null

    constructor() {
        super()
        this.fecha = null
        this.hora_salida = null
        this.hora_llegada = null
        this.km_inicial = null
        this.km_final = null
        this.tanque_inicio = 0
        this.tanque_final = 0
        this.firmada = false
        this.chofer = null
        this.chofer_id = null
        this.vehiculo = null
    }
}