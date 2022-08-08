import { EntidadAuditable } from '@/app/shared/entidad/domain/entidadAuditable'

export class Ciudad extends EntidadAuditable {
  descripcion: string
  provincia: number | null

  constructor() {
    super()
    this.descripcion = ''
    this.provincia = null
  }
}
