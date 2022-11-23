import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoTarea extends EntidadAuditable {
  cliente: number | null
  nombre: string | null
  plantilla: string | null
  requiere_imagenes: boolean
  requiere_campos_adicionales: boolean
  imagenes_adicionales: []
  campos_adicionales: []

  constructor() {
    super()
    this.cliente = null
    this.nombre = null
    this.plantilla = null
    this.requiere_imagenes = false
    this.requiere_campos_adicionales = false
    this.imagenes_adicionales = []
    this.campos_adicionales = []
  }
}
