import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class DatoBancario extends EntidadAuditable {
    banco: string | null
    empresa: string | null
    tipo_cuenta: string | null
    numero_cuenta: string | null
    identificacion: string | null
    nombre_propietario: string | null

    constructor() {
        super()
        this.banco = null
        this.empresa = null
        this.tipo_cuenta = null
        this.numero_cuenta = null
        this.identificacion = null
        this.nombre_propietario = null
    }
}
