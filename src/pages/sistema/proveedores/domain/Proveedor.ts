import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { Ref, ref } from "vue";

export class Proveedor extends EntidadAuditable {
  empresa: number | null
  estado: boolean | null
  razon_social: string | null
  sucursal: string | null
  ubicacion: string | null
  canton: number | string | null
  parroquia: string | null
  direccion: string | null
  celular: string | null
  sitio_web: string | null
  telefono: string | null
  contactos: any[]

  referencia: string | null
  forma_pago: string | null
  plazo_credito: string | null
  anticipos: string | null

  //arrays de relaciones muchos a muchos
  tipos_ofrece: any[]
  categorias_ofrece: any[]
  departamentos: any[]

  //auxiliares
  calificacion: number | null
  estado_calificado: string | null


  //logistica del proveedor
  tiempo_entrega: string | null
  envios: boolean
  tipo_envio: any[] | string
  transporte_incluido: boolean
  costo_transporte: string | null
  garantia: boolean

  constructor() {
    super()
    this.empresa = null
    this.estado = true
    this.razon_social = null
    this.sucursal = null
    this.ubicacion = null
    this.canton = null
    this.parroquia = null
    this.direccion = null
    this.celular = null
    this.telefono = null
    this.sitio_web = null
    this.contactos = []
    this.tipos_ofrece = []
    this.categorias_ofrece = []
    this.departamentos = []

    this.referencia = null
    this.forma_pago = null
    this.plazo_credito = null
    this.anticipos = null

    //Auxiliares
    this.calificacion = null
    this.estado_calificado = null

    //logistica del proveedor
    this.tiempo_entrega = null
    this.envios = false
    this.tipo_envio = []
    this.transporte_incluido = false
    this.costo_transporte = null
    this.garantia = false
  }
}
