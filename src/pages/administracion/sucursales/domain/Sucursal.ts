import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Sucursal extends EntidadAuditable {
    lugar: string | null
    telefono: string | null
    correo: string | null
    extension: string | null
    cliente:number | null
    cliente_id:number | null
    activo: boolean
    // administrador: string | null

    constructor() {
        super()
        this.lugar = null
        this.telefono = null
        this.correo = null
        this.extension = null
        this.cliente = null
        this.cliente_id = null
        this.activo = true
        // this.administrador = null
    }
}