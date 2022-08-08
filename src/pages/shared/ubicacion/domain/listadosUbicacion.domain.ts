import { Pais } from '@/app/sistema/pais/domain/pais'
import { Provincia } from '@/app/sistema/provincia/domain/provincia'
import { Ciudad } from '@/app/sistema/ciudad/domain/ciudad'

export interface ListadosUbicacion {
  paisesListado: Pais[]
  ciudadesListado: Ciudad[]
  provinciasListado: Provincia[]
}
