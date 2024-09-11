import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AlimentacionGrupo extends EntidadAuditable {
    tarea: number | null
    tarea_id?: number | null
    subtarea_id?: number | null
    coordinador: string | null
    observacion: string | null
    grupo_id?: number | null
    grupo: number | null
    cantidad_personas: number | null
    precio: number | null
    total: number | null
    fecha: string | null
    // tipos_alimentacion: number[]
    tipo_alimentacion: number | null
    tipo_alimentacion_id: number | null

    alimentacion_grupos: AlimentacionGrupo[]

    constructor() {
        super()
        this.tarea = null
        this.tarea_id = null
        this.coordinador = null
        this.observacion = null
        this.grupo_id = null
        this.grupo = null
        this.cantidad_personas = null
        this.precio = null
        this.total = null
        this.fecha = null
        // this.tipos_alimentacion = []
        this.tipo_alimentacion = null
        this.tipo_alimentacion_id = null
        
        this.alimentacion_grupos = []
    }
}