import { TabOption } from "components/tables/domain/TabOption"
import { CausaIntervencion } from "pages/gestionTrabajos/formulariosTrabajos/emergencias/view/CausaIntervencion"

export const nivelesTrabajos = {
  TAREA: 0,
  SUBTAREA_N1: 1,
  SUBTAREA_N2: 2,
  SUBTAREA_N3: 3,
}

export const mediosNotificacion = [
  'CORREO',
  'LLAMADA',
  'CHAT',
]

export const modosAsignacionTrabajo = { por_grupo: 'POR_GRUPO', por_empleado: 'POR_EMPLEADO' }

export const destinosTareas = {
  paraProyecto: 'PARA_PROYECTO',
  paraClienteFinal: 'PARA_CLIENTE_FINAL',
}

export const ubicacionesTrabajo = {
  clienteFinal: 'CLIENTE_FINAL',
  ruta: 'RUTA',
}

export const tabOptionsEstadosTareas: TabOption[] = [
  // { label: 'Todo', value: '' },
  { label: 'Activas', value: 0 },
  { label: 'Finalizadas', value: 1 },
];

export const tabOptionsEstadosSubtareas: TabOption[] = [
  { label: 'Todo', value: '' },
  // { label: 'Creado', value: 'CREADO' },
  // { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  //{ label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]

export const tabOptionsEstadosSubtareasMonitor: TabOption[] = [
  //{ label: 'Todo', value: '' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]

export const tabTrabajoAsignado: TabOption[] = [
  //{ label: 'Todo', value: '' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  //{ label: 'Realizado', value: 'REALIZADO' },
  { label: 'Próximos trabajos', value: 'PROXIMO' },
  /*{ label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },*/
]

export const modosStock: TabOption[] = [
  { label: 'Para tareas', value: 'TAREAS' },
  { label: 'Stock personal', value: 'PERSONAL' },
]

// Listados estaticos
export const motivosMovilizacion = [
  { id: 'IDA', descripcion: 'IDA AL TRABAJO' },
  { id: 'REGRESO', descripcion: 'REGRESO DEL TRABAJO' },
]

// Emergencias
export const tiposIntervenciones = [
  { id: 'CF', descripcion: 'CORTE FIBRA' },
  { id: 'MTTO', descripcion: 'MANTENIMIENTO' },
  { id: 'SPT', descripcion: 'SOPORTE' },
  { id: 'TP', descripcion: 'TAREA PROGRAMADA' },
]

export const causaIntervencion: CausaIntervencion[] =
  [
    { categoria: 'TP', descripcion: 'TP-ARREGLO PATCH NODO' },
    { categoria: 'TP', descripcion: 'TP-CAMBIO DE MANGAS' },
    { categoria: 'TP', descripcion: 'TP-CAMBIO DE TRAMO' },
    { categoria: 'TP', descripcion: 'TP-EMERGENTES' },
    { categoria: 'TP', descripcion: 'TP-MIGRACION DE ENLACES' },
    { categoria: 'TP', descripcion: 'TP-RECUPERACIÓN HILOS' },
    { categoria: 'TP', descripcion: 'TP-REGULARIZACION DE TRAMOS' },
    { categoria: 'TP', descripcion: 'TP-REPARACIÓN/CAMBIO ODF' },
    { categoria: 'TP', descripcion: 'TP-REVISIÓN DE ATENUACIÓN' },
    { categoria: 'TP', descripcion: 'TP-SEPARACIÓN DE RUTA' },

    { categoria: 'CF', descripcion: 'CF-ACCESORIOS DE SUJECIÓN EN POSTES' },
    { categoria: 'CF', descripcion: 'CF-ACCIDENTE DE TRANSITO' },
    { categoria: 'CF', descripcion: 'CF-AMPLIACION DE VIAS/REGENERACION' },
    { categoria: 'CF', descripcion: 'CF-CAIDA DE ARBOL ' },
    { categoria: 'CF', descripcion: 'CF-CAIDA DE POSTES' },
    { categoria: 'CF', descripcion: 'CF-CAMBIO DE TRAMO/FALLA NO DETERMINADA' },
    { categoria: 'CF', descripcion: 'CF-CORTE MACHETE/PODA DE ARBOL' },
    { categoria: 'CF', descripcion: 'CF-DEMOLICIONES' },
    { categoria: 'CF', descripcion: 'CF-DERRUMBE/DESLAVE/INUNDACION/LLUVIAS' },
    { categoria: 'CF', descripcion: 'CF-DESASTRES NATURALES' },
    { categoria: 'CF', descripcion: 'CF-DESCARGA ELECTRICA/FIBRA QUEMADA' },
    { categoria: 'CF', descripcion: 'CF-DISPARO EN FIBRA' },
    { categoria: 'CF', descripcion: 'CF-ERROR HUMANO' },
    { categoria: 'CF', descripcion: 'CF-EXTENSION DE VENTANA PROGRAMADA' },
    { categoria: 'CF', descripcion: 'CF-INSECTOS/ROEDORES' },
    { categoria: 'CF', descripcion: 'CF-INTENTO ROBO DE CABLE/MANGAS' },
    { categoria: 'CF', descripcion: 'CF-MANGA CAIDA / MANGA MAL ESTADO' },
    { categoria: 'CF', descripcion: 'CF-MAQUINARIA PESADA/CARGA ELEVADA' },
    { categoria: 'CF', descripcion: 'CF-QUEMA DE MALEZA/FIBRA QUEMADA' },
    { categoria: 'CF', descripcion: 'CF-REGENERACIÓN URBANA' },
    { categoria: 'CF', descripcion: 'CF-RETIRO POSTES' },
    { categoria: 'CF', descripcion: 'CF-SABOTAJE' },
    { categoria: 'CF', descripcion: 'CF-TAREA NO NOTIFICADA' },
    { categoria: 'CF', descripcion: 'CF-TRABAJOS DE OPERADOR EXTERNO' },

    { categoria: 'MTTO', descripcion: 'MTTO-ARMADO DE MANGA' },
    { categoria: 'MTTO', descripcion: 'MTTO-CAMBIO A NUEVOS POSTES' },
    { categoria: 'MTTO', descripcion: 'MTTO-CAMBIO DE AMARRAS' },
    { categoria: 'MTTO', descripcion: 'MTTO-COLOCACION DE ETIQUETAS' },
    { categoria: 'MTTO', descripcion: 'MTTO-FIBRA EN EL SUELO' },
    { categoria: 'MTTO', descripcion: 'MTTO-RETEMPLADO DE FIBRA' },
    { categoria: 'MTTO', descripcion: 'MTTO-CERTIFICACION DE HILOS' },

    { categoria: 'SPT', descripcion: 'SPT-CAMBIO DE EQUIPO' },
    { categoria: 'SPT', descripcion: 'SPT-CAMBIO DE VENTILADORES' },
    { categoria: 'SPT', descripcion: 'SPT-CAMBIO MODULO ODF' },
    { categoria: 'SPT', descripcion: 'SPT-CAMBIO PATCH' },
    { categoria: 'SPT', descripcion: 'SPT-CAMBIO SFP' },
    { categoria: 'SPT', descripcion: 'SPT-REFUSION PIGTAIL' },
    { categoria: 'SPT', descripcion: 'SPT-REINICIO DE EQUIPO' },
    { categoria: 'SPT', descripcion: 'SPT-REVISION UM CLIENTE' },
    { categoria: 'SPT', descripcion: 'STP-CAMBIO/REVISION DE FUENTE' },
    { categoria: 'SPT', descripcion: 'SPT-ASISTENCIA MANOS REMOTAS' },
    { categoria: 'SPT', descripcion: 'SPT-ACOMPAÑAMIENTO PROVEEDORES' },
    { categoria: 'SPT', descripcion: 'SPT-ACOMPAÑAMIENTO CLIENTE' },
    { categoria: 'SPT', descripcion: 'SPT-REVISION ELECTRICA' },
    { categoria: 'SPT', descripcion: 'SPT-REVISION CLIMATIZACION' },
    { categoria: 'SPT', descripcion: 'SPT-REVISION ALARMAS/SEGURIDAD' },
    { categoria: 'SPT', descripcion: 'SPT-REVISION NODO' },
  ]
