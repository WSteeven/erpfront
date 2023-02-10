import { Hidratable } from './Hidratable'

export class Entidad extends Hidratable {
  id: number | null

  constructor() {
    super()
    this.id = null
  }
}
