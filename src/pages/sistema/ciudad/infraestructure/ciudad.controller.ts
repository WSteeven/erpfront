import { Ciudad } from '@/app/sistema/ciudad/domain/ciudad'
import { TransaccionSimpleController } from '@/app/shared/contenedor/modules/simple/infraestructure/transacccionSimple.controller'
import { endpoints } from '@config/api.config'
import { columnaImportable } from '@/app/shared/importable/domain/importable'
export class CiudadController extends TransaccionSimpleController<Ciudad> {
  constructor() {
    super(endpoints.ciudades)
  }

  obtenerPlantillaImportable(): columnaImportable<Ciudad>[] {
    return []
  }
}
