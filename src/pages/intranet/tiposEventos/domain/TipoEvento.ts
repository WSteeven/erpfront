import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class TipoEvento extends EntidadAuditable{
  nombre:string|null
  activo:boolean

  constructor(){
    super()
    this.nombre = null
    this.activo = true
  }
}
