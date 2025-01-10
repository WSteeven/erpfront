import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ServicioBasico } from 'trabajoSocial/servicios_basicos/domain/ServicioBasico'
import { FamiliaAcogiente } from 'trabajoSocial/informacion_vivienda/domain/FamiliaAcogiente'

export class Vivienda extends EntidadAuditable {
  tipo: string | null
  numero_plantas: string | null
  material_paredes: string | null
  material_techo: string | null
  material_piso: string | null
  distribucion_vivienda: any
  comodidad_espacio_familiar: string | null
  numero_personas: number | null
  numero_dormitorios: number | null
  existe_hacinamiento: boolean
  existe_upc_cercano: boolean
  tiene_donde_evacuar: boolean
  otras_consideraciones: string | null
  imagen_croquis: string | null
  telefono: string | null
  coordenadas: string | null
  direccion: string | null
  referencia: string | null
  servicios_basicos: ServicioBasico | null
  familia_acogiente: FamiliaAcogiente | null

  // posibles amenazas
  amenaza_inundacion: string | null
  amenaza_deslaves: string | null
  otras_amenazas_previstas: any
  otras_amenazas: string | null
  existe_peligro_tsunami: boolean
  existe_peligro_lahares: boolean

  constructor() {
    super()
    this.tipo = null
    this.numero_plantas = null
    this.material_paredes = null
    this.material_techo = null
    this.material_piso = null
    this.distribucion_vivienda = []
    this.numero_dormitorios = null
    this.numero_personas = null
    this.comodidad_espacio_familiar = null
    this.existe_hacinamiento = false
    this.existe_upc_cercano = false
    this.tiene_donde_evacuar = false
    this.otras_consideraciones = null
    this.imagen_croquis = null
    this.telefono = null
    this.coordenadas = null
    this.direccion = null
    this.referencia = null
    this.servicios_basicos = new ServicioBasico()
    this.familia_acogiente = new FamiliaAcogiente()

    this.amenaza_inundacion = null
    this.amenaza_deslaves = null
    this.otras_amenazas_previstas = []
    this.otras_amenazas = null
    this.existe_peligro_tsunami = null
    this.existe_peligro_lahares = null
  }
}
