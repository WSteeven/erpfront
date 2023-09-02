import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";
import { Ref, ref } from "vue";

export class Proveedor extends EntidadAuditable {
  empresa: number | null
  estado: boolean | null
  razon_social: string | null
  sucursal: string | null
  ubicacion: string | null
  canton: string | null
  parroquia: string | null
  direccion: string | null
  celular: string | null
  sitio_web: string | null
  telefono: string | null
  contactos: Ref<any[]>

  //arrays de relaciones muchos a muchos
  tipos_ofrece: any[]
  categorias_ofrece: Ref<any[]>
  departamentos: any[]

  //auxiliares
  calificacion: number | null
  estado_calificado: string | null

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
    this.contactos = ref([])
    this.tipos_ofrece = []
    this.categorias_ofrece = ref([])
    this.departamentos = []

    //Auxiliares
    this.calificacion = null
    this.estado_calificado = null
  }
}
