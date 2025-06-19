export class SeguimientoAccidenteConsultaMedica {
    empleado_id: number | null
    empleado: string | null
    telefono: string | null
    grupo: string | null
    cargo: string | null
    dias_descanso: number | null
    cita_medica: number | null
    cita_medica_atendida: boolean
    dado_alta: boolean

    constructor() {
        this.empleado_id = null
        this.empleado = null
        this.telefono = null
        this.grupo = null
        this.cargo = null
        this.dias_descanso = null
        this.cita_medica = null
        this.cita_medica_atendida = false
        this.dado_alta = false
    }
}