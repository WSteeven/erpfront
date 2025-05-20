import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Progresiva extends EntidadAuditable {
  metadatos: string | null
  filename: string | null
  proyecto: string | null
  ciudad: string | null
  enlace: string | null
  fecha_instalacion: string | null
  cod_bobina: string | null
  mt_inicial: string | null
  mt_final: string | null
  fo_instalada: string | null
  num_tarea: string | null
  hilos: string | null
  responsable: string | null

  constructor() {
    super()
    this.metadatos = null
    this.filename = null
    this.proyecto = null
    this.ciudad = null
    this.enlace = null
    this.fecha_instalacion = null
    this.cod_bobina = null
    this.mt_inicial = null
    this.mt_final = null
    this.fo_instalada = null
    this.num_tarea = null
    this.hilos = null
    this.responsable = null
  }
}
