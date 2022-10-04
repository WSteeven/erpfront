export class Tecnico {
  id: number | null
  tecnico: string | null
  contacto: string | null
  grupo: string | null
  disponibilidad: boolean
  observacion: string | null

  constructor() {
    this.id = null
    this.tecnico = null
    this.contacto = null
    this.grupo = null
    this.disponibilidad = true
    this.observacion = null
  }
}
