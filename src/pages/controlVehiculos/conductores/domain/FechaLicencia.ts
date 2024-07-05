import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class FechaLicencia extends EntidadAuditable {
    tipo_licencia: number | null
    inicio_vigencia: string | null
    fin_vigencia: string | null

    constructor() {
        super()
        this.tipo_licencia = null
        this.inicio_vigencia = null
        this.fin_vigencia = null
    }
}