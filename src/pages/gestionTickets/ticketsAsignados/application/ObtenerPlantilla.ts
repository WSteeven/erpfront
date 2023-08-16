import { TrabajoAsignadoModales } from '../domain/TrabajoAsignadoModales'
import { plantillas } from 'config/plantillas'

export class ObtenerPlantilla {

  obtener(tipoTrabajo: string): any {//keyof TrabajoAsignadoModales {
    switch (tipoTrabajo) {
      case plantillas.INSTALACION:
        return 'EmergenciaPage'
      case plantillas.EMERGENCIA:
        return 'EmergenciaPage'
      case plantillas.DESMONTAJE:
        return 'EmergenciaPage'
      default: return 'EmergenciaPage'
    }
  }
}
