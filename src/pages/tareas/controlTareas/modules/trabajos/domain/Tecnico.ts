export class Tecnico {
  id: number | null
  nombres: string | null
  apellidos: string | null
  grupo: string | null
  disponibilidad: boolean
  observacion: string | null

  constructor() {
    this.id = null
    this.nombres = null
    this.apellidos = null
    this.grupo = null
    this.disponibilidad = true
    this.observacion = null
  }
}
