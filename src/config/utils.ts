import { TabOption } from 'components/tables/domain/TabOption'
import { CausaIntervencion } from 'pages/gestionTrabajos/formulariosTrabajos/emergencias/view/CausaIntervencion'
// import { CausaIntervencion } from 'pages/tareas/controlTareas/modules/subtareas/modules/controlAvance/view/CausaIntervencion'

export const maskFecha = 'DD-MM-YYYY'
//export const maskFecha = 'YYYY/MM/DD'
// Tipos
export type TipoSeleccion = 'none' | 'single' | 'multiple'

export const acciones = {
  nuevo: 'NUEVO',
  eliminar: 'ELIMINAR',
  consultar: 'CONSULTAR',
  editar: 'EDITAR',
}

export const tiposElementos = [
  'POSTE',
  'POZO',
  'AMERICANO',
  'NODO',
]
export const tiposTension = ['BAJA TENSIÓN', 'MEDIA TENSIÓN', 'ALTA TENSIÓN', 'DATOS']
export const propietariosElementos = [
  'CNEL',
  'CNT',
  'CONCEL',
  'OTECEL',
  'TELCONET',
  'NEDETEL',
  'SETEL',
  'PRIVADO',
  'EERRS',
  'CENTRO SUR'
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

export const tabOptionsTransaccionesIngresos: TabOption[] = [
  { label: 'Todo', value: 'TODO' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Parcial', value: 'PARCIAL' },
  { label: 'Completa', value: 'COMPLETA' },
]
export const tabOptionsDevoluciones: TabOption[] = [
  { label: 'Creadas', value: 'CREADA' },
  { label: 'Anuladas', value: 'ANULADA' },
]
export const tabOptionsTransferencias: TabOption[] = [
  { label: 'Pendientes', value: 'PENDIENTE' },
  { label: 'Tránsito', value: 'TRANSITO' },
  { label: 'Completadas', value: 'COMPLETADO' },
]
export const tabOptionsPedidos: TabOption[] = [
  { label: 'Por autorizar', value: 'PENDIENTE' },
  { label: 'Aprobados', value: 'APROBADO' },
  { label: 'Cancelados', value: 'CANCELADO' },
  { label: 'Completados', value: 'COMPLETA' },
]
export const tabOptionsTraspasos: TabOption[] = [
  { label: 'Pendientes', value: '0' },
  { label: 'Devueltas', value: '1' },
]
export const tabOptionsTransacciones: TabOption[] = [
  { label: 'Todo', value: 'TODO' },
  /* { label: 'En espera', value: 'ESPERA' }, */
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Parcial', value: 'PARCIAL' },
  { label: 'Completa', value: 'COMPLETA' },
]
export const tabAutorizarGasto: TabOption[] = [
  { label: 'Aprobada', value: '1' },
  { label: 'Rechazada', value: '2' },
  { label: 'Pendiente', value: '3' },
  { label: 'Anulado', value: '4' },
]
export const tabGestionarEgresos: TabOption[] = [
  { label: 'Aprobada', value: 'ACEPTADA' },
  // { label: 'Rechazada', value: 'RECHAZADA' },
  { label: 'Pendiente', value: 'PENDIENTE' },
]
export const tabAutorizarTransferenciaSaldo: TabOption[] = [
  { label: 'Aprobada', value: '1' },
  { label: 'Rechazada', value: '2' },
  { label: 'Pendiente', value: '3' },
]

export const accionesTabla = {
  name: 'acciones',
  field: 'acciones',
  label: 'Acciones',
  align: 'center',
  //style: 'width: 1000px'
}

export const tiposTrabajosEstaticos = {
  tendido: 'TENDIDO',
  hincado: 'HINCADO',
}

export const motivos = {
  venta: 'VENTA',
  compraProveedor: 'COMPRA A PROVEEDOR',
  mercaderiaClienteTarea: 'MERCADERIA DE CLIENTE PARA TAREA',
  devolucionFinalizacionLaboral: 'DEVOLUCION POR FINALIZACION LABORAL',
  devolucionTarea: 'DEVOLUCION DE TAREA',
  stockInicial: 'STOCK INICIAL',
  despachoTarea: 'DESPACHO DE TAREA',
  despacho: 'DESPACHO',
  devolucionAlProveedor: 'DEVOLUCION AL PROVEEDOR',
  reposicion: 'REPOSICION',
  ingresoTransferenciaBodegas: 'INGRESO TRANSFERENCIA ENTRE BODEGAS',
  egresoTransferenciaBodegas: 'EGRESO TRANSFERENCIA ENTRE BODEGAS',
  ingresoLiquidacionMateriales: 'INGRESO POR LIQUIDACION DE MATERIALES',
  egresoLiquidacionMateriales: 'EGRESO POR LIQUIDACION DE MATERIALES',
  ingresoAjusteRegularizacion: 'AJUSTE DE INGRESO POR REGULARIZACION',
  egresoAjusteRegularizacion: 'AJUSTE DE EGRESO POR REGULARIZACION',
  mercaderiaClienteStock: 'MERCADERIA DE CLIENTE PARA STOCK',
  devolucionGarantia: 'DEVOLUCION POR GARANTIA',
  devolucionDanio: 'DEVOLUCION POR DAÑO',
  despachoGarantia: 'DESPACHO POR GARANTIA',
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
  no_realizada: 'NO REALIZADA',
}

export const estadosControlStock = {
  suficiente: 'STOCK SUFICIENTE',
  reorden: 'PROXIMO A AGOTARSE',
  minimo: 'DEBAJO DEL MINIMO',
}

export const estadosInventarios = {
  inventario: 'INVENTARIO',
  transito: 'TRANSITO',
  sin_stock: 'SIN STOCK',
}
export const estadosCondicionesId = {
  nuevo: '1',
  usado: '2',
  mal_estado: '3',
  danado: '4',
}
export const estadosCondicionesValue = {
  nuevo: 'NUEVO',
  usado: 'USADO',
  mal_estado: 'MAL ESTADO',
  danado: 'DAÑADO',
}

export const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const sistemasCoordenadas = ['DMS', 'UTM']

export const bobinasSolicitadas = ['DS564', 'DSFDS564']

export const estadosDevoluciones = {
  CREADA: 'CREADA',
  ANULADA: 'ANULADA',
}
export const estadosTrabajos = {
  CREADO: 'CREADO',
  ASIGNADO: 'ASIGNADO',
  AGENDADO: 'AGENDADO',
  EJECUTANDO: 'EJECUTANDO',
  PAUSADO: 'PAUSADO',
  SUSPENDIDO: 'SUSPENDIDO',
  //PENDIENTE: 'PENDIENTE',
  CANCELADO: 'CANCELADO',
  REALIZADO: 'REALIZADO',
  FINALIZADO: 'FINALIZADO',
  //REAGENDADO: 'REAGENDADO',
}
export const estadosGastos = {
  APROBADO: 1,
  RECHAZADO: 2,
  PENDIENTE: 3,
  ANULADO: 4,
}
export const estadosTransferencias = {
  APROBADO: 1,
  RECHAZADO: 2,
  PENDIENTE: 3,
}

export const estadosTrabajoArray = [
  'CREADO',
  'ASIGNADO',
  'AGENDADO',
  'EJECUTANDO',
  'PAUSADO',
  'SUSPENDIDO',
  'CANCELADO',
  'REALIZADO',
  'FINALIZADO',
]

export const rolesSistema = {
  contabilidad: 'CONTABILIDAD',
  gerente: 'GERENTE',
  rrhh: 'RECURSOS HUMANOS',
  empleado: 'EMPLEADO',
  coordinador: 'COORDINADOR',
  coordinadorBackup: 'COORDINADOR_BACKUP',
  jefe_tecnico: 'JEFE TECNICO',
  fiscalizador: 'FISCALIZADOR',
  bodega: 'BODEGA',
  activos_fijos: 'ACTIVOS FIJOS',
  tecnico: 'TECNICO',
  tecnico_lider: 'LIDER DE GRUPO',
  secretario: 'SECRETARIO',
}

export const cargosSistema = {
  tecnico_lider: 'TECNICO LIDER DE GRUPO',
  tecnico_secretario: 'TECNICO SECRETARIO',
}

export const tiposJornadas = ['INICIO DE JORNADA', 'FIN DE JORNADA']

export const tiposMovimientos = {
  ingreso: 'INGRESO',
  egreso: 'EGRESO',
}

export const opcionesEstados = [
  { value: 1, label: 'ACTIVO' },
  { value: 0, label: 'INACTIVO' }
]

export const opciones_tipo_contribuyente = [
  { value: 'NATURAL', label: 'NATURAL' },
  { value: 'PRIVADA', label: 'PRIVADA' },
  { value: 'PUBLICA', label: 'PUBLICA' },
]
