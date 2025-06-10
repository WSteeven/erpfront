import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import {Ref} from 'vue';

export class Departamento extends EntidadAuditable {
  id:number|null
  nombre: string | null
  activo: boolean
  responsable: string | number | null
  responsable_id: number | null
  telefono: string|null
  correo: string|null
  cant_empleados: number | null
  empleados: Ref<any[]>[]|null


  constructor() {
    super()
    this.id = null
    this.nombre = null
    this.activo = true
    this.responsable = null
    this.responsable_id = null
    this.telefono = null
    this.correo = null
    this.cant_empleados = null
    this.empleados = []
  }
}
