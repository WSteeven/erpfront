import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class BitacoraVehicular extends EntidadAuditable {
    fecha: string | null
    hora_salida: string | null
    hora_llegada: string | null
    km_inicial: string | null
    km_final: string | null
    tanque_inicio: number | null
    tanque_final: number | null
    firmada: boolean
    chofer: string | null
    chofer_id: number | null
    vehiculo: string | null

    //partes del vehiculo
    parabrisas: string | null
    limpiaparabrisas: string | null
    luces_interiores: string | null
    aire_acondicionado: string | null
    aceite_motor: string | null
    liquido_freno: string | null
    aceite_hidraulico: string | null
    liquido_refrigerante: string | null
    filtro_combustible: string | null
    bateria: string | null
    cables_conexiones: string | null
    luces_exteriores: string | null
    frenos: string | null
    amortiguadores: string | null
    tire_rf: string | null //delantera derecha
    tire_lf: string | null //delantera izquierda
    tire_rr: string | null //trasera derecha
    tire_lr: string | null //trasera izquierda

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

        // partes del vehiculo
        this.parabrisas = 'success'
        this.limpiaparabrisas = 'success'
        this.luces_interiores = 'success'
        this.aire_acondicionado = 'success'
        this.aceite_motor = 'success'
        this.liquido_freno = 'success'
        this.aceite_hidraulico = 'success'
        this.liquido_refrigerante = 'success'
        this.filtro_combustible = 'success'
        this.bateria = 'success'
        this.cables_conexiones = 'success'
        this.luces_exteriores = 'success'
        this.frenos = 'success'
        this.amortiguadores = 'success'
        this.luces_exteriores = 'success'
        this.frenos = 'success'
        this.amortiguadores = 'success'
        this.tire_rf = 'success'
        this.tire_lf = 'success'
        this.tire_rr = 'success'
        this.tire_lr = 'success'
    }
}