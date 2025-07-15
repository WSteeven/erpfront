import {EntidadAuditable} from 'shared/entidad/domain/entidadAuditable';

export class ExamenOrganoReproductivo extends EntidadAuditable{
    examen: string | null
    tipo: string | null
    activo:boolean

    constructor() {
        super()
        this.examen = null
        this.tipo = null
        this.activo = true
    }
}