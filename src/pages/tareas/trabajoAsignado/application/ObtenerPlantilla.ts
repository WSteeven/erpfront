import { plantillas } from 'config/plantillas'
import { TrabajoAsignadoModales } from '../domain/TrabajoAsignadoModales'
/* import { Subtarea } from 'pages/tareas/controlTareas/modules/subtareas/domain/Subtarea';
import { Ref } from 'vue' */

export class ObtenerPlantilla {

  constructor() {
    // 
  }

  obtener(tipoTrabajo: string): keyof TrabajoAsignadoModales {
    switch (tipoTrabajo) {
      case plantillas.INSTALACION:
        return 'ControlTendido'
      case plantillas.EMERGENCIA:
        return 'EmergenciaPage'
      default: return 'ControlTendido'
    }
  }
}
