import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import {reactive} from 'vue';

export class Tarea extends EntidadAuditable {
  fecha: string | null
  tipo_actividad: string | null
  asignada: boolean
  grupo: string | null
  estado_tarea: string | null
  orden_trabajo: string | null
  nombre_cliente: string | null
  direccion: string | null
  referencia: string | null
  latitud: number | null
  longitud: number | null
  coordenadas: []
  observacion: string | null
  telefonos: string[]
  comentario_anulacion: string | null //no se usa

  constructor() {
    super()
    this.tipo_actividad = null
    this.asignada = true
    this.comentario_anulacion = null
    this.telefonos = []
    this.coordenadas = reactive([])

  }
}
