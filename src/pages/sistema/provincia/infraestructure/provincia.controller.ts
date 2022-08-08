import { Provincia } from '@/app/sistema/provincia/domain/provincia'
import { TransaccionSimpleController } from '@/app/shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'
import { endpoints } from '@config/api.config'
import { columnaImportable } from '@/app/shared/importable/domain/importable'

export class ProvinciaController extends TransaccionSimpleController<Provincia> {
  constructor() {
    super(endpoints.provincias)
  }

  obtenerPlantillaImportable(): columnaImportable<Provincia>[] {
    return []
  }
}
