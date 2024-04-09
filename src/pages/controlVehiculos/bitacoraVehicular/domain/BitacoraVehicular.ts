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
    actividadesRealizadas: any
    tareas: string | null
    tickets: string | null

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
    llantas: string | null //todas las llantas
    observacion_checklist_interior: string | null
    observacion_checklist_bajo_capo: string | null
    observacion_checklist_exterior: string | null

    //accesorios del vehículo
    botiquin: string | null
    extintor: string | null
    caja_herramientas: string | null
    triangulos: string | null
    llanta_emergencia: string | null
    cinturones: string | null
    gata: string | null
    portaescalera: string | null
    observacion_accesorios_vehiculo: string | null

    //imagenes del vehículo
    imagen_frontal: string | null
    imagen_trasera: string | null
    imagen_lateral_derecha: string | null
    imagen_lateral_izquierda: string | null
    imagen_tablero_km: string | null
    imagen_tablero_radio: string | null
    imagen_asientos: string | null
    imagen_accesorios: string | null


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
        this.actividadesRealizadas = []
        this.tareas = null
        this.tickets = null

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
        this.llantas = 'success'
        this.observacion_checklist_interior = null
        this.observacion_checklist_bajo_capo = null
        this.observacion_checklist_exterior = null

        //accesorios del vehículo
        this.botiquin = 'lleno'
        this.extintor = 'lleno'
        this.caja_herramientas = 'lleno'
        this.triangulos = 'buen estado'
        this.llanta_emergencia = 'buen estado'
        this.cinturones = 'buen estado'
        this.gata = 'buen estado'
        this.portaescalera = 'buen estado'
        this.observacion_accesorios_vehiculo= null

        //imagenes del vehículo
        this.imagen_frontal = null
        this.imagen_trasera = null
        this.imagen_lateral_derecha = null
        this.imagen_lateral_izquierda = null
        this.imagen_tablero_km = null
        this.imagen_tablero_radio = null
        this.imagen_asientos = null
        this.imagen_accesorios = null

    }
}