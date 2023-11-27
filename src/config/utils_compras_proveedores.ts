import { TabOption } from "components/tables/domain/TabOption"

export const opcionesTipoContribuyente = [
  { value: 'PERSONA NATURAL', label: 'PERSONA NATURAL' },
  { value: 'SOCIEDAD', label: 'SOCIEDAD' },
  // { value: 'PUBLICA', label: 'PUBLICA' },
]

export const opcionesTipoNegocio = [
  { value: 'RIMPE EMPRENDEDOR', label: 'RIMPE EMPRENDEDOR' },
  { value: 'RIMPE NEGOCIOS POPULARES', label: 'RIMPE NEGOCIOS POPULARES' },
  { value: 'GENERAL', label: 'GENERAL' },
]
export const opcionesTipoContacto = [
  { value: 'TECNICO', label: 'TÉCNICO' },
  { value: 'FINANCIERO', label: 'FINANCIERO' },
  { value: 'COMERCIAL', label: 'COMERCIAL' },
]
export const tiposCuentas = [
  { value: 'AHORROS', label: 'AHORROS' },
  { value: 'CORRIENTE', label: 'CORRIENTE' },
]
export const tiposEnvios = [
  { value: 'LOCALES', label: 'LOCALES' },
  { value: 'NACIONALES', label: 'NACIONALES' },
]
export const opcionesForma = [
  { value: 'CONTADO', label: 'CONTADO' },
  { value: 'CREDITO', label: 'CREDITO' },
  { value: 'TRANSFERENCIA', label: 'TRANSFERENCIA' },
  { value: 'CHEQUE', label: 'CHEQUE' },
  { value: 'CANJE', label: 'CANJE' },
]
export const opcionesTiempo = [
  { value: '3 DIAS', label: '3 DIAS' },
  { value: '7 DIAS', label: '7 DIAS' },
  { value: '15 DIAS', label: '15 DIAS' },
  { value: '30 DIAS', label: '30 DIAS' },
]

export const opcionesOfertas = [
  { value: 1, label: 'BIENES' },
  { value: 2, label: 'SERVICIOS' },
]
export const opcionesUnidadesMedida = [
  { value: 1, label: 'UNIDAD' },
  { value: 2, label: 'KILOGRAMO' },
  { value: 3, label: 'METRO' },
  { value: 4, label: 'METRO' },
  { value: 5, label: 'KILOMETRO' },
  { value: 6, label: 'KILOMETRO CUBICO' },
  { value: 7, label: 'LITRO' },
  { value: 8, label: 'KIT' },
]
export const tiposOfertas = {
  bienes: 'BIENES',
  servicios: 'SERVICIOS',
}

export const likertCalificacion = [
  { label: 'MUY BUENO', value: '5' },
  { label: 'BUENO', value: '4' },
  { label: 'NORMAL', value: '3' },
  { label: 'MALO', value: '2' },
  { label: 'MUY MALO', value: '1' },
]

export const tabOptionsPrefactura: TabOption[] = [
  { label: 'Creadas', value: '2' }, //estado CREADO
  { label: 'Anuladas', value: '4' }, //estado ANULADO
]
export const tabOptionsOrdenCompra: TabOption[] = [
  { label: 'Pendientes', value: '1' }, //autorizacion PENDIENTE
  { label: 'Autorizadas', value: '2' }, //autorizacion APROBADO
  { label: 'Revisadas', value: '6' },  //revisadas
  { label: 'Realizadas', value: '4' },  //realizada
  { label: 'Pagadas', value: '5' },  //pagada
  { label: 'Canceladas', value: '3' },  //autorizacion CANCELADO
]
export const tabOptionsProformas: TabOption[] = [
  { label: 'Pendientes', value: '1' }, //autorizacion PENDIENTE
  { label: 'Autorizadas', value: '2' }, //autorizacion APROBADO
  { label: 'Canceladas', value: '3' },  //autorizacion CANCELADO
  { label: 'Completadas', value: '4' }, //estado ANULADO
  { label: 'Anuladas', value: '5' }  //autorizacion CANCELADO
]
export const tabOptionsPreordenCompra: TabOption[] = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Completa', value: 'COMPLETA' },
  { label: 'Anulada', value: 'NO REALIZADA' }
]

export const estadosCalificacionProveedor = {
  vacio: 'SIN CONFIGURAR',
  pendiente: 'SIN CALIFICAR',
  calificado: 'CALIFICADO',
  parcial: 'PARCIAL',
}

export const formasPagos = [
  { value: 'CHEQUE', label: 'CHEQUE' },
  { value: 'CREDITO', label: 'CREDITO' },
  { value: 'DEPOSITO', label: 'DEPOSITO' },
  { value: 'EFECTIVO', label: 'EFECTIVO' },
  { value: 'MULTIPLE', label: 'MULTIPLE' },
  { value: 'NC INTERNA', label: 'NC INTERNA' },
  { value: 'ND INTERNA', label: 'ND INTERNA' },
  { value: 'NOTA DE CREDITO', label: 'NOTA DE CREDITO' },
  { value: 'NOTA DE DEBITO', label: 'NOTA DE DEBITO' },
  { value: 'TARJETA DE CREDITO', label: 'TARJETA DE CREDITO' },
]

export const ofertas = [
  { value: 1, label: 'BIENES' },
  { value: 2, label: 'SERVICIOS' },
]

export const opcionesReportesProveedores = [
  { value: 0, label: 'RUC' },
  { value: 1, label: 'RAZON SOCIAL' },
  { value: 2, label: 'NOMBRE COMERCIAL' },
  { value: 3, label: 'CIUDAD' },
  { value: 4, label: 'CATEGORIAS' },
]

export const opcionesCalificacionProveedor = [
  { value: 'SIN CONFIGURAR', label: 'SIN CONFIGURAR' },
  { value: 'SIN CALIFICAR', label: 'SIN CALIFICAR' },
  { value: 'CALIFICADO', label: 'CALIFICADO' },
  { value: 'PARCIAL', label: 'PARCIAL' },
]

export const estadosOrdenesCompras = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  REVISADA: 'REVISADA',
  REALIZADA: 'REALIZADA',
  PAGADA: 'PAGADA',
  ANULADA: 'ANULADA'
}
