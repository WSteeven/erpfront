import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ClienteFinal extends EntidadAuditable {
  id_cliente_final: string | null
  nombres: string | null
  apellidos: string | null
  celular: string | null
  provincia: number | null
  canton: number | null
  parroquia: string | null
  direccion: string | null
  referencia: string | null
  coordenada_latitud: string | null
  coordenada_longitud: string | null
  cliente: number | null
  cedula: string | null
  correo: string | null
  medio_transmision: string | null
  tendido_interior_cable: string | null
  provincia_nombre: string | null
  canton_nombre: string | null

  constructor() {
    super()
    this.id_cliente_final = null
    this.nombres = null
    this.apellidos = null
    this.celular = null
    this.provincia = null
    this.canton = null
    this.parroquia = null
    this.direccion = null
    this.referencia = null
    this.coordenada_latitud = null
    this.coordenada_longitud = null
    this.cliente = null
    this.cedula = null
    this.correo = null
    // Informacion tecnica
    this.medio_transmision = null
    this.tendido_interior_cable = null
    this.provincia_nombre = null
    this.canton_nombre = null
  }
}
