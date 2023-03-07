import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Parroquia extends EntidadAuditable {
    parroquia: string
    canton_id: number | null
    cod_parroquia: number | null
    cod_postal: number | null

    constructor() {
        super()
        this.parroquia =''
        this.canton_id = null
        this.cod_parroquia = null
        this.cod_postal = null
    }
}
