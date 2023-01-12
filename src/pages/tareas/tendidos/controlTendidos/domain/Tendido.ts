import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tendido extends EntidadAuditable {
  marca_inicial: number | null
  marca_final: number | null
  subtarea: number | null
  tarea: number | null
  bobina: number | null
  cantidad_hilos: number | null
  cantidad_postes: number | null
  cantidad_pozos: number | null
  progresiva_inicio: number | null
  progresiva_fin: number | null
  metraje_tendido: number | null
  fecha: string | null

  constructor() {
    super()

    this.marca_inicial = null
    this.marca_final = null
    this.subtarea = null
    this.tarea = null
    this.bobina = null
    this.cantidad_hilos = null
    this.cantidad_postes = null
    this.cantidad_pozos = null
    this.progresiva_inicio = null
    this.progresiva_fin = null
    this.metraje_tendido = null
    this.fecha = null
  }
}
