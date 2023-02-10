import { EntidadAuditable } from '@/app/shared/entidad/domain/entidadAuditable'

export class Pais extends EntidadAuditable {
  descripcion: string

  constructor() {
    super()
    this.descripcion = ''
  }
}
