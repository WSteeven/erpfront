import { Endpoint } from 'shared/http/domain/Endpoint'

export const tareas = {
  tareas_conecel: new Endpoint('tareas-conecel/tareas'),
  tareas_conecel_lotes: new Endpoint('tareas-conecel/subir-tareas-lotes'),
  tipos_actividades_conecel: new Endpoint('tareas-conecel/tipos-actividades'),
  ubicaciones_gps: new Endpoint('tareas-conecel/ubicaciones-gps'),

}