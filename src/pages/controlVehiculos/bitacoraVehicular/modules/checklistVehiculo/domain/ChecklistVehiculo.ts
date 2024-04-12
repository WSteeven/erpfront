import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ChecklistVehiculo extends EntidadAuditable {
    //partes del vehiculo
    bitacora_id: number| null
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

    constructor() {
        super()
        this.bitacora_id = null
        this.parabrisas = 'CORRECTO'
        this.limpiaparabrisas = 'CORRECTO'
        this.luces_interiores = 'CORRECTO'
        this.aire_acondicionado = 'CORRECTO'
        this.aceite_motor = 'CORRECTO'
        this.liquido_freno = 'CORRECTO'
        this.aceite_hidraulico = 'CORRECTO'
        this.liquido_refrigerante = 'CORRECTO'
        this.filtro_combustible = 'CORRECTO'
        this.bateria = 'CORRECTO'
        this.cables_conexiones = 'CORRECTO'
        this.luces_exteriores = 'CORRECTO'
        this.frenos = 'CORRECTO'
        this.amortiguadores = 'CORRECTO'
        this.luces_exteriores = 'CORRECTO'
        this.frenos = 'CORRECTO'
        this.amortiguadores = 'CORRECTO'
        this.llantas = 'CORRECTO'
        this.observacion_checklist_interior = null
        this.observacion_checklist_bajo_capo = null
        this.observacion_checklist_exterior = null
    }
}