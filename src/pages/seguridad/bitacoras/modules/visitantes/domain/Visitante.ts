import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Visitante extends EntidadAuditable {
    nombre_completo: string | null = null
    identificacion: string | null = null
    celular: string | null = null
    motivo_visita: string | null = null
    persona_visitada: string | null = null
    placa_vehiculo: string | null = null
    fecha_hora_ingreso: string | null = null
    fecha_hora_salida: string | null = null
    observaciones: string | null = null

    // Foreign keys
    actividad_bitacora: number | null = null
}