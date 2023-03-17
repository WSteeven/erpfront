import { TrabajoAsignadoModales } from '../domain/TrabajoAsignadoModales'
import { plantillas } from 'config/plantillas'

export class ObtenerPlantilla {

  obtener(tipoTrabajo: string): keyof TrabajoAsignadoModales {
    switch (tipoTrabajo) {
      case plantillas.INSTALACION:
        return 'ControlTendido'
      case plantillas.EMERGENCIA:
        return 'EmergenciaPage'
      case plantillas.DESMONTAJE:
        return 'DesmontajePage'
      default: return 'AvanceGenericoPage'
    }
  }
}
