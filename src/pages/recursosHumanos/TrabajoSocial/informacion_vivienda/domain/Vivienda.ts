import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ServicioBasico } from 'trabajoSocial/servicios_basicos/domain/ServicioBasico'

export class Vivienda extends EntidadAuditable {
  tipo: string | null
  material_paredes: string | null
  material_techo: string | null
  material_piso: string | null
  distribucion_vivienda: any
  comodidad_espacio_familiar: string | null
  numero_dormitorios: number | null
  existe_hacinamiento: boolean
  existe_upc_cercano: boolean
  otras_consideraciones: string | null
  imagen_croquis: string|null
  telefono: string|null
  coordenadas: string|null
  direccion: string|null
  referencia: string|null
  servicios_basicos: ServicioBasico|null

  constructor() {
    super()
    this.tipo = null
    this.material_paredes = null
    this.material_techo = null
    this.material_piso = null
    this.distribucion_vivienda = []
    this.numero_dormitorios = null
    this.comodidad_espacio_familiar = null
    this.existe_hacinamiento = false
    this.existe_upc_cercano = false
    this.otras_consideraciones = null
    this.imagen_croquis = null
    this.telefono = null
    this.coordenadas = null
    this.direccion = null
    this.referencia = null
    this.servicios_basicos = new ServicioBasico()
  }
}
