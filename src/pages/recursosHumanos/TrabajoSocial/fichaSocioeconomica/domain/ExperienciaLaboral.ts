import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ExperienciaLaboral extends EntidadAuditable{
  nombre_empresa: string|null
  cargo: string|null
  antiguedad: string|null
  asegurado_iess: boolean
  telefono: number|null
  fecha_retiro: string|null
  motivo_retiro: string|null

  constructor() {
    super()
    this.nombre_empresa=null
    this.cargo=null
    this.antiguedad=null
    this.asegurado_iess=false
    this.telefono=null
    this.fecha_retiro=null
    this.motivo_retiro=null
  }






}
