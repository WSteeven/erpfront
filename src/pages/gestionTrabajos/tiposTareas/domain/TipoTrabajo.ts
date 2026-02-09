import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
/* import { CamposAdicionales } from './CamposAdicionales'
import { ImagenesAdicionales } from './ImagenesAdicionales' */

export class TipoTrabajo extends EntidadAuditable {
    cliente: number | null
    descripcion: string | null
    url_plantilla: string | null
    _method: string
    cliente_id: number | null
    activo: boolean

    constructor() {
        super()
        this.cliente = null
        this.descripcion = null
        this.url_plantilla = null
        this.cliente_id = null
        this.activo = true
        this._method = 'GET'
    }
}
