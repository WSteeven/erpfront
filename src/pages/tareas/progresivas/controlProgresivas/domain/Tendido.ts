import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tendido extends EntidadAuditable {
  marca_inicial: number | null
  marca_final: number | null
  subtarea: number | null
  bobina: number | null
  cantidad_hilos: number | null
  cantidad_postes: number | null
  cantidad_pozos: number | null
  progresiva_inicio: number | null
  progresiva_fin: number | null
  metraje_tendido: number | null

  constructor() {
    super()

    this.marca_inicial = null
    this.marca_final = null
    this.subtarea = null
    this.bobina = 1
    this.cantidad_hilos = 48
    this.cantidad_postes = 18
    this.cantidad_pozos = 0
    this.progresiva_inicio = 2500
    this.progresiva_fin = 150
    this.metraje_tendido = 2350
  }
}
