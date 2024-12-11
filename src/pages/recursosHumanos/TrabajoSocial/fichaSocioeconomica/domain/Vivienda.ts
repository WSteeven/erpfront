import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Vivienda extends EntidadAuditable {
  tipo: string | null
  material_paredes: string | null
  material_techo: string | null
  material_piso: string | null
  comodidad_espacio_familiar: string | null
  numero_dormitorios: number | null
  existe_hacinamiento: boolean
  existe_upc_cercano: boolean
  otras_consideraciones:string | null

  constructor() {
    super()
    this.tipo = null
    this.material_paredes = null
    this.material_techo = null
    this.material_piso = null
    this.numero_dormitorios = null
    this.comodidad_espacio_familiar = null
    this.existe_hacinamiento =false
    this.existe_upc_cercano =false
    this.otras_consideraciones =null
  }
}
