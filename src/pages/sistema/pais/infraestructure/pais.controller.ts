import { Pais } from '@/app/sistema/pais/domain/pais'
import { TransaccionSimpleController } from '@/app/shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'
import { endpoints } from '@config/api.config'
import { columnaImportable } from '@/app/shared/importable/domain/importable'
// import {columnaImportable} from "@shared/importable/domain/importable"

export class PaisController extends TransaccionSimpleController<Pais> {
  constructor() {
    super(endpoints.paises)
  }

  obtenerPlantillaImportable(): columnaImportable<Pais>[] {
    return []
  }
}
