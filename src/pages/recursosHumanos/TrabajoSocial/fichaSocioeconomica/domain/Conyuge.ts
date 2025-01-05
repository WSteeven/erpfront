import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Conyuge extends EntidadAuditable{
  nombres: string|null
  apellidos: string|null
  nombres_apellidos: string|null
  nivel_academico: string|null
  edad: number|null
  profesion: string|null // u ocupacion
  telefono: string|null
  tiene_dependencia_laboral: boolean
  promedio_ingreso_mensual: number|null


  constructor() {
    super()
    this.nombres=null
    this.apellidos=null
    this.nombres_apellidos=null
    this.nivel_academico=null
    this.edad=null
    this.profesion=null
    this.telefono=null
    this.tiene_dependencia_laboral=false
    this.promedio_ingreso_mensual=null
  }






}
