import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoEventoBitacora extends EntidadAuditable {
    nombre: string | null = null
    descripcion: string | null = ''
    notificacion_inmediata = false
    notificacion_inmediata_texto: string | null = null
    activo = true
}