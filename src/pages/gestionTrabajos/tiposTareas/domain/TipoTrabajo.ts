import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
/* import { CamposAdicionales } from './CamposAdicionales'
import { ImagenesAdicionales } from './ImagenesAdicionales' */

export class TipoTrabajo extends EntidadAuditable {
  cliente: number | null
  descripcion: string | null
  cliente_id: number | null
  /* plantilla: string | null
  requiere_imagenes: boolean
  requiere_campos_adicionales: boolean
  imagenes_adicionales: ImagenesAdicionales[]
  campos_adicionales: CamposAdicionales[] */

  constructor() {
    super()
    this.cliente = null
    this.descripcion = null
    this.cliente_id = null
    /* this.plantilla = null
    this.requiere_imagenes = false
    this.requiere_campos_adicionales = false
    this.imagenes_adicionales = []
    this.campos_adicionales = [] */
  }
}
