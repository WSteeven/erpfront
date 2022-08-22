export class AsistenciaTecnico {
  id: number | null
  nombres: string | null
  apellidos: string | null
  grupo: string | null
  observacion: string | null
  asiste: boolean

  constructor() {
    this.id = null
    this.nombres = null
    this.apellidos = null
    this.grupo = null
    this.observacion = null
    this.asiste = false
  }
}
