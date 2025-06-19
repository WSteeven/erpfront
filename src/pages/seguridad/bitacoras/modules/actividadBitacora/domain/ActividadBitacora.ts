import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Visitante } from '../../visitantes/domain/Visitante'

export class ActividadBitacora extends EntidadAuditable {
    fecha_hora_inicio: string | null = null
    fecha_hora_fin: string | null = null
    tipo_evento_bitacora: number | null = null
    notificacion_inmediata = false
    actividad: string | null = null
    fotografia_evidencia_1: string | null = null
    fotografia_evidencia_2: string | null = null
    medio_notificacion: string | null = null
    tiene_adjuntos = false
    visitante: Visitante | null = new Visitante()
    bitacora: number | null = null

    // Auxiliar
    mostrar_seccion_archivos_adjuntos = false
    mostrar_seccion_visitante = false
}