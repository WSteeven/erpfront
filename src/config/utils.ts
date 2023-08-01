import { TabOption } from 'components/tables/domain/TabOption'

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

export const tabOptionsTransaccionesIngresos: TabOption[] = [
  { label: 'Todo', value: 'TODO' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Parcial', value: 'PARCIAL' },
  { label: 'Completa', value: 'COMPLETA' },
]
export const tabOptionsDevoluciones: TabOption[] = [
  { label: 'Por autorizar', value: 'PENDIENTE' },
  { label: 'Aprobados', value: 'APROBADO' },
  { label: 'Cancelados', value: 'CANCELADO' },
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
export const tabOptionsSolicitudPedido: TabOption[] = [
  { label: 'Pendiente', value: '1' },
  { label: 'Validado', value: '4' },
  { label: 'Aprobados', value: '2' },
  { label: 'Cancelados', value: '3' },
]
export const tabOptionsLicencias: TabOption[] = [
  { label: 'Pendiente', value: '1' },
  { label: 'Aprobados', value: '2' },
  { label: 'Cancelados', value: '3' },
]
export const tabOptionsVacaciones: TabOption[] = [
  { label: 'Pendiente', value: '1' },
  { label: 'Validado', value: '4' },
  { label: 'Aprobados', value: '2' },
  { label: 'Cancelados', value: '3' },
]
export const tabOptionsPermiso: TabOption[] = [
  { label: 'Pendiente', value: '1' },
  { label: 'Aprobados', value: '2' },
  { label: 'Cancelados', value: '3' },
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
  administrador: 'ADMINISTRADOR',
  compras: 'COMPRAS',
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

export const opcionesTipoContribuyente = [
  { value: 'NATURAL', label: 'NATURAL' },
  { value: 'PRIVADA', label: 'PRIVADA' },
  { value: 'PUBLICA', label: 'PUBLICA' },
]

export const opcionesReportesIngresos = [
  { value: 0, label: 'POR SOLICITANTE' },
  { value: 1, label: 'POR BODEGUERO' }, //PERSONA QUE ATIENDE
  { value: 2, label: 'POR MOTIVO' },
  { value: 3, label: 'POR BODEGA' },
  { value: 4, label: 'POR DEVOLUCIÓN' },
  { value: 5, label: 'POR TAREA' },
  { value: 6, label: 'POR TRANSFERENCIA' },
]

export const tiposReportesIngresos = {
  solicitante: 0, //empleado
  bodeguero: 1, //bodeguero
  motivo: 2,
  sucursal: 3,
  devolucion: 4,
  tarea: 5,
  transferencia: 6,
}

export const opcionesReportesEgresos = [
  { value: 0, label: 'POR SOLICITANTE' },
  { value: 1, label: 'POR PERSONA QUE AUTORIZA' },
  { value: 2, label: 'POR PERSONA QUE RETIRA' },
  { value: 3, label: 'POR RESPONSABLE' },
  { value: 4, label: 'POR BODEGUERO' }, //PERSONA QUE ATIENDE
  { value: 5, label: 'POR MOTIVO' },
  { value: 6, label: 'POR BODEGA' },
  { value: 7, label: 'POR PEDIDO' },
  { value: 8, label: 'POR CLIENTE' },
  { value: 9, label: 'POR TAREA' },
  { value: 10, label: 'POR TRANSFERENCIA' },
]

export const tiposReportesEgresos = {
  solicitante: 0, //empleado
  autorizador: 1, //persona que autoriza el pedido
  retira: 2, //persona que retira la encomienda o pedido
  responsable: 3, //responsable de los materiales
  bodeguero: 4, //bodeguero
  motivo: 5,
  sucursal: 6,
  pedido: 7,
  cliente: 8,
  tarea: 9,
  transferencia: 10,
}

export const departamentos = {
  xtrim_cuenca: 'XTRIM CUENCA',
  medico: 'MEDICO',
  activos_fijos: 'ACTIVOS FIJOS',
  gerencia: 'GERENCIA',
  proyectos: 'PROYECTOS',
  recursos_humanos: 'RECURSOS HUMANOS',
  tecnico: 'TECNICO',
  contabilidad: 'CONTABILIDAD',
  informatica: 'INFORMATICA',
  bodega: 'BODEGA',
  sso: 'SSO',
  vehiculos: 'VEHICULOS',
}
