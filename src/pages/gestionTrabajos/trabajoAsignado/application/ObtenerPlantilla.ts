import { TrabajoAsignadoModales } from '../domain/TrabajoAsignadoModales'
import { plantillas } from 'config/plantillas'

export class ObtenerPlantilla {

  constructor() {
    //
  }

  obtener(tipoTrabajo: string): keyof TrabajoAsignadoModales {
    switch (tipoTrabajo) {
      case plantillas.INSTALACION:
        console.log(plantillas.INSTALACION)
        return 'ControlTendido'
      case plantillas.EMERGENCIA:
        console.log(plantillas.EMERGENCIA)
        return 'EmergenciaPage'
      default: return 'ControlTendido'
    }
  }
}
