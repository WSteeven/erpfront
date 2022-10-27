import { TabOption } from "components/tables/domain/TabOption"

// Tipos
export type TipoSeleccion = 'none' | 'single' | 'multiple'

export const acciones = {
  nuevo: 'NUEVO',
  eliminar: 'ELIMINAR',
  consultar: 'CONSULTAR',
  editar: 'EDITAR',
}

export const provincias = ['EL ORO', 'AZUAY', 'CAÑAR', 'CARCHI']
export const ciudades = ['MACHALA', 'PASAJE', 'SANTA ROSA']
export const tiposElementos = [
  'POSTE',
  'CAJA',
  'AMERICANO',
  'RADIO BASE',
  'NODO',
]
export const propietariosElementos = [
  'NO POSEE',
  'TELCONET',
  'CONECEL',
  'OTECEL',
  'CNEL',
  'CAJA',
  'EMPRESA ELECTRICA QUITO',
  'CNT',
  'NEDETEL',
]

export const estadoElementos = ['BUENO', 'MALO']

export const grupos = ['MACHALA', 'SANTO DOMINGO']

export const tiposInstalaciones = ['SUBTERRÁNEA', 'AEREA']

export const tiposTareasTelconet = [
  {
    label: 'TENDIDO DE FIBRA',
    value: 1,
  },
  {
    label: 'COLOCACIÓN DE CAJAS',
    value: 2,
  },
]

export const tiposTareasNedetel = ['TENDIDO DE FIBRA', 'COLOCACIÓN DE CAJAS']

export const regiones = ['R1', 'R2', 'R3', 'R4']

export const atenciones = ['URBANO', 'INTERURBANO']

export const tiposIntervenciones = [
  { id: 'CF', descripcion: 'CORTE FIBRA' },
  { id: 'MTTO', descripcion: 'MANTENIMIENTO' },
  { id: 'SPT', descripcion: 'SOPORTE' },
  { id: 'TP', descripcion: 'TAREA PROGRAMADA' },
]

export const causaIntervencion =
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

export const tabOptions: TabOption[] = [
  { label: 'Todo', value: '' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Realizado', value: 'REALIZADO' },
]

export const tabOptionsTransacciones: TabOption[]=[
  { label: 'Todo', value: 'TODO' },
  { label: 'En espera', value: 'ESPERA' },
  { label: 'Parcial', value: 'PARCIAL' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Completa', value: 'COMPLETA' },
]

export const accionesTabla = {
  name: 'acciones',
  field: 'acciones',
  label: 'Acciones',
  align: 'center',
}

export const tiposTrabajosEstaticos = {
  tendido: 'TENDIDO',
  hincado: 'HINCADO',
}


export const accionesActivos = {
  asignado: 'ASIGNACION',
  devuelto: 'DEVOLUCION',
}

export const autorizacionesTransacciones = {
  pendiente: 'PENDIENTE',
  aprobado: 'APROBADO',
  cancelado: 'CANCELADO',
}

export const estadosTransacciones = {
  pendiente: 'PENDIENTE',
  completa: 'COMPLETA',
  parcial: 'PARCIAL',
}

export const sistemasCoordenadas = ['DMS', '']