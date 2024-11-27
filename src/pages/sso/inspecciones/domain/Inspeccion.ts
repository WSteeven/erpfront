import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { estadosInspecciones } from 'pages/sso/config/utils'

export class Inspeccion extends EntidadAuditable {
    titulo: string | null
    descripcion: string | null
    estado: string | null
    fecha_inicio: string | null
    responsable: number | null | string
    finalizado: boolean

    constructor() {
        super()
        this.titulo = null
        this.descripcion = null
        this.estado = estadosInspecciones.CREADO
        this.fecha_inicio = null
        this.responsable = null
        this.finalizado = false
    }
} 