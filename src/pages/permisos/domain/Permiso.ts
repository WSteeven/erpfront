import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Permiso extends EntidadAuditable {
  id: number | null;
  name: string | null
  role_id: number | null
  roles: any[] | null
  autorizar: boolean
  acceder: boolean
  ver: boolean
  crear: boolean
  editar: boolean
  eliminar: boolean
  permiso_personalizado: boolean


  constructor() {
    super()
    this.id = null
    this.name = null
    this.role_id = null
    this.roles = null
    this.autorizar=false
    this.acceder=false
    this.ver=false
    this.crear=false
    this.editar=false
    this.eliminar=false
    this.permiso_personalizado=false //falso si es normal, true si es personalizado
  }
}
