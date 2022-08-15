export class SolicitudMateriales {
  fecha_solicitud: string | null
  grupo: string | null
  estado: string | null

  constructor() {
    this.fecha_solicitud = null
    this.grupo = null
    this.estado = null // Completo - Pendiente - Parcial
  }
}
