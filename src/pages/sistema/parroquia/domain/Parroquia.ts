import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Parroquia extends EntidadAuditable {
    provincia: string | null
    canton: string | null
    parroquia: string
    canton_id: number | null
    cod_parroquia: number | null
    cod_postal: number | null

    constructor() {
        super()
        this.provincia = null
        this.canton = null
        this.parroquia = ''
        this.canton_id = null
        this.cod_parroquia = null
        this.cod_postal = null
    }
}
