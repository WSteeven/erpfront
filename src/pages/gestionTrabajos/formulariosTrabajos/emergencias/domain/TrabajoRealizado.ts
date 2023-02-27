import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export default class TrabajoRealizado extends EntidadAuditable {
    id: number | null
    hora: string | null
    actividad: string | null
    observacion: string | null

    constructor() {
        super()
        this.id = null
        this.hora = null
        this.actividad = null
        this.observacion = null
    }
}